package com.veterinary.auth.infrastructure.security;

import java.security.SecureRandom;
import java.util.Base64;

import org.bouncycastle.crypto.generators.Argon2BytesGenerator;
import org.bouncycastle.crypto.params.Argon2Parameters;

/**
 * Handles secure password hashing using the Argon2id algorithm.
 *
 * <p>
 * Argon2id is the recommended algorithm for password hashing as of 2024,
 * combining resistance against both GPU-based attacks and side-channel attacks.
 * This implementation uses the Bouncy Castle library, which is pure Java and
 * works seamlessly with GraalVM native compilation.</p>
 *
 * <h2>Output Format</h2>
 * <p>
 * Hashes follow the PHC (Password Hashing Competition) string format:</p>
 * <pre>{@code $argon2id$v=19$m=65536,t=3,p=4$<salt>$<hash>}</pre>
 *
 * <p>
 * This format is self-describing and interoperable with other Argon2
 * implementations across different languages and platforms.</p>
 *
 * <h2>Usage Example</h2>
 * <pre>{@code
 * Argon2Hasher hasher = new Argon2Hasher();
 *
 * // During registration
 * String hash = hasher.hash("userPassword123");
 * saveToDatabase(hash);
 *
 * // During login
 * String storedHash = getFromDatabase();
 * if (hasher.verify(storedHash, "userPassword123")) {
 *     // Password is correct
 *     if (hasher.needsRehash(storedHash)) {
 *         // Upgrade to current security parameters
 *         String newHash = hasher.hash("userPassword123");
 *         updateDatabase(newHash);
 *     }
 * }
 * }</pre>
 *
 * <h2>Thread Safety</h2>
 * <p>
 * This class is thread-safe. Multiple threads can share a single instance.</p>
 *
 * @author MrBabylonian
 * @see <a href="https://datatracker.ietf.org/doc/html/rfc9106">RFC 9106 -
 * Argon2 Memory-Hard Function</a>
 */
public class Argon2Hasher {

    /**
     * Number of passes over memory. Higher values increase computation time and
     * resistance against attacks, but also increase login latency.
     */
    private static final int ITERATIONS = 3;
    /**
     * Memory usage in kilobytes (64 MB). This is the primary defense against
     * GPU-based attacks, as GPUs have limited memory per core.
     */
    private static final int MEMORY = 65536;
    /**
     * Number of parallel threads. Should match available CPU cores for optimal
     * performance, but also increases memory usage proportionally.
     */
    private static final int PARALLELISM = 4;
    /**
     * Output hash length in bytes (256 bits). This provides sufficient security
     * margin for all foreseeable applications.
     */
    private static final int HASH_LENGTH = 32;
    /**
     * Salt length in bytes (128 bits). Randomly generated for each hash to
     * ensure identical passwords produce different hashes.
     */
    private static final int SALT_LENGTH = 16;

    private final SecureRandom secureRandom;

    /**
     * Creates a new Argon2 hasher with a cryptographically secure random number
     * generator for salt generation.
     */
    public Argon2Hasher() {
        this.secureRandom = new SecureRandom();
    }

    /**
     * Hashes a password using Argon2id with current security parameters.
     *
     * <p>
     * Each call generates a unique random salt, so hashing the same password
     * twice will produce different outputs. This is intentional and correct —
     * use {@link #verify} to check passwords, not string comparison.</p>
     *
     * <h3>Example</h3>
     * <pre>{@code
     * String hash = hasher.hash("mySecurePassword");
     * // Result: $argon2id$v=19$m=65536,t=3,p=4$randomSalt$derivedHash
     * }</pre>
     *
     * @param password the plain-text password to hash (never stored directly)
     * @return the encoded hash string containing algorithm, parameters, salt,
     * and hash
     * @throws IllegalArgumentException if password is null or empty
     */
    public String hash(String password) {
        // Generate a random salt
        byte[] salt = new byte[SALT_LENGTH];
        this.secureRandom.nextBytes(salt);

        // Configuration
        Argon2Parameters params = new Argon2Parameters.Builder(
                Argon2Parameters.ARGON2_id)
                .withIterations(ITERATIONS)
                .withMemoryAsKB(MEMORY)
                .withParallelism(PARALLELISM)
                .withSalt(salt)
                .build();

        Argon2BytesGenerator generator = new Argon2BytesGenerator();
        generator.init(params);

        byte[] hash = new byte[HASH_LENGTH];
        generator.generateBytes(password.toCharArray(), hash);

        return encodeHash(salt, hash);
    }

    /**
     * Verifies a password against a previously generated hash.
     *
     * <p>
     * This method extracts the salt and parameters from the stored hash,
     * re-hashes the provided password using those exact settings, and compares
     * the results using constant-time comparison to prevent timing attacks.</p>
     *
     * <h3>Example</h3>
     * <pre>{@code
     * String storedHash = getFromDatabase(userId);
     * boolean isValid = hasher.verify(storedHash, userInputPassword);
     *
     * if (isValid) {
     *     grantAccess();
     * } else {
     *     denyAccess();
     * }
     * }</pre>
     *
     * <h3>Security Note</h3>
     * <p>
     * This method deliberately takes the same amount of time regardless of
     * where a mismatch occurs, preventing attackers from using response timing
     * to guess the hash byte-by-byte.</p>
     *
     * @param encodedHash the stored hash string in PHC format
     * @param password the plain-text password to verify
     * @return {@code true} if the password matches, {@code false} otherwise
     * @throws IllegalArgumentException if either parameter is null, empty, or
     * malformed
     */
    public boolean verify(String encodedHash, String password) {
        HashComponents components = parseHash(encodedHash);

        Argon2BytesGenerator generator = new Argon2BytesGenerator();
        generator.init(components.params);

        byte[] actualHash = new byte[components.hash().length];
        generator.generateBytes(password.toCharArray(), actualHash);
        return constantTimeEquals(components.hash, actualHash);
    }

    /**
     * Checks whether a hash should be upgraded to current security parameters.
     *
     * <p>
     * As hardware improves and security recommendations evolve, you may
     * increase the hashing parameters. This method identifies hashes created
     * with older, weaker settings that should be rehashed on next login.</p>
     *
     * <h3>Recommended Usage Pattern</h3>
     * <pre>{@code
     * // Only rehash AFTER successful verification
     * if (hasher.verify(storedHash, password)) {
     *     if (hasher.needsRehash(storedHash)) {
     *         String upgradedHash = hasher.hash(password);
     *         updateDatabase(userId, upgradedHash);
     *     }
     *     grantAccess();
     * }
     * }</pre>
     *
     * <h3>Why After Verification?</h3>
     * <p>
     * Rehashing requires the plain-text password, which we only have during
     * login. We must verify first to ensure the password is correct before
     * using it to generate a new hash.</p>
     *
     * @param encodedHash the stored hash string in PHC format
     * @return {@code true} if the hash uses outdated parameters and should be
     * upgraded
     * @throws IllegalArgumentException if the hash is null, empty, or malformed
     */
    public boolean needsRehash(String encodedHash) {
        HashComponents components = parseHash(encodedHash);
        return components.memory != MEMORY
                || components.iterations != ITERATIONS
                || components.parallelism != PARALLELISM;
    }

    /**
     * Holds the parsed components of an encoded Argon2 hash string.
     *
     * @param iterations time cost (number of passes)
     * @param memory memory cost in kilobytes
     * @param parallelism degree of parallelism
     * @param params pre-built Argon2Parameters ready for the generator
     * @param hash the raw hash bytes for comparison
     */
    private record HashComponents(
            int iterations,
            int memory,
            int parallelism,
            Argon2Parameters params,
            byte[] hash) {

    }

    /**
     * Parses an encoded hash string into its constituent components.
     *
     * <h3>Parsing Process</h3>
     * <pre>{@code
     * Input: "$argon2id$v=19$m=65536,t=3,p=4$c2FsdA$aGFzaA"
     *
     * Step 1: Split by "$"
     *   ┌───────┬──────────┬───────┬─────────────────┬────────┬────────┐
     *   │   0   │    1     │   2   │        3        │   4    │   5    │
     *   ├───────┼──────────┼───────┼─────────────────┼────────┼────────┤
     *   │  ""   │ argon2id │ v=19  │ m=65536,t=3,p=4 │ salt64 │ hash64 │
     *   └───────┴──────────┴───────┴─────────────────┴────────┴────────┘
     *
     * Step 2: Split parts[3] by ","
     *   ["m=65536", "t=3", "p=4"]
     *
     * Step 3: Extract values with substring(2)
     *   "m=65536" → 65536 (memory)
     *   "t=3"     → 3     (iterations)
     *   "p=4"     → 4     (parallelism)
     *
     * Step 4: Base64 decode parts[4] and parts[5]
     *   "c2FsdA" → byte[] salt
     *   "aGFzaA" → byte[] hash
     * }</pre>
     *
     * @param encodedHash the hash string in PHC format
     * @return a record containing parsed parameters and hash bytes
     * @throws ArrayIndexOutOfBoundsException if format is invalid
     * @throws NumberFormatException if parameters cannot be parsed
     * @throws IllegalArgumentException if Base64 decoding fails
     */
    private HashComponents parseHash(String encodedHash) {
        String[] parts = encodedHash.split("\\$");
        String[] paramTokens = parts[3].split(",");

        Base64.Decoder decoder = Base64.getDecoder();

        int memory = Integer.parseInt(paramTokens[0].substring(2));
        int iterations = Integer.parseInt(paramTokens[1].substring(2));
        int parallelism = Integer.parseInt(paramTokens[2].substring(2));
        byte[] salt = decoder.decode(parts[4]);
        byte[] hash = decoder.decode(parts[5]);

        Argon2Parameters params = new Argon2Parameters.Builder(Argon2Parameters.ARGON2_id)
                .withSalt(salt)
                .withIterations(iterations)
                .withMemoryAsKB(memory)
                .withParallelism(parallelism)
                .build();

        return new HashComponents(memory, iterations, parallelism, params, hash);
    }

    /**
     * Encodes raw salt and hash bytes into the standard PHC string format.
     *
     * <p>
     * The output format is recognized by Argon2 implementations across all
     * major programming languages, ensuring interoperability.</p>
     *
     * <h3>Encoding Process</h3>
     * <pre>{@code
     * Input:
     *   salt = [0x73, 0x61, 0x6C, 0x74, ...]  (16 random bytes)
     *   hash = [0x68, 0x61, 0x73, 0x68, ...]  (32 derived bytes)
     *
     * Step 1: Base64 encode (without padding)
     *   salt → "c2FsdHNhbHRzYWx0"
     *   hash → "aGFzaGhhc2hoYXNo"
     *
     * Step 2: Format into PHC string
     *   $argon2id$v=19$m=65536,t=3,p=4$c2FsdHNhbHRzYWx0$aGFzaGhhc2hoYXNo
     *   │        │    │              │                 │
     *   │        │    │              │                 └─► hash (Base64)
     *   │        │    │              └─► salt (Base64)
     *   │        │    └─► m=memory, t=iterations, p=parallelism
     *   │        └─► v=version (19 = v1.3)
     *   └─► algorithm identifier
     * }</pre>
     *
     * <h3>Why Base64?</h3>
     * <p>
     * Raw bytes can contain unprintable characters, nulls, and special
     * characters that break storage systems. Base64 converts bytes to safe
     * ASCII characters (A-Z, a-z, 0-9, +, /).</p>
     *
     * <h3>Why No Padding?</h3>
     * <p>
     * Standard Base64 adds '=' padding to make output length divisible by 4.
     * The PHC format specifies no padding for compactness. Decoders handle
     * both.</p>
     *
     * @param salt the random salt bytes (16 bytes)
     * @param hash the derived hash bytes (32 bytes)
     * @return the fully encoded hash string in PHC format
     */
    private String encodeHash(byte[] salt, byte[] hash) {
        Base64.Encoder encoder = Base64.getEncoder().withoutPadding();
        return String.format("$argon2id$v=%d$m=%d,t=%d,p=%d$%s$%s",
                Argon2Parameters.ARGON2_VERSION_13,
                MEMORY,
                ITERATIONS,
                PARALLELISM,
                encoder.encodeToString(salt),
                encoder.encodeToString(hash));
    }

    /**
     * Compares two byte arrays in constant time to prevent timing attacks.
     *
     * <h3>The Problem: Timing Attacks</h3>
     * <p>
     * A naive comparison exits early on first mismatch:</p>
     * <pre>{@code
     * Arrays.equals([0xAA, 0xBB, 0xCC], [0xFF, ...])
     *                 ↑
     *                 Mismatch! Returns immediately (fast)
     *
     * Arrays.equals([0xAA, 0xBB, 0xCC], [0xAA, 0xBB, 0xFF])
     *                             ↑
     *                             Mismatch! Returns later (slower)
     *
     * Attacker measures response time:
     *   • Fast response → first bytes wrong
     *   • Slow response → more bytes correct
     *   • Recovers hash byte-by-byte!
     * }</pre>
     *
     * <h3>The Solution: Check ALL Bytes</h3>
     * <pre>{@code
     * XOR (^): Returns 0 if bytes equal, non-zero if different
     *
     *   0xAA ^ 0xAA = 0x00  ← Equal
     *   0xAA ^ 0xFF = 0x55  ← Different
     *
     * OR (|=): Accumulates differences (once set, stays set, non reversible)
     *
     *   result = 0          [00000000] alarm OFF
     *   result |= 0x00      [00000000] still OFF (bytes matched)
     *   result |= 0x55      [01010101] alarm ON! (mismatch found)
     *   result |= 0x00      [01010101] stays ON (sticky!)
     *
     * Final: result == 0 means ALL bytes matched
     * }</pre>
     *
     * <h3>Visual: Alarm System Analogy</h3>
     * <pre>{@code
     * ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
     * │ Byte 0  │ │ Byte 1  │ │ Byte 2  │ │ Byte 3  │
     * │ Sensor  │ │ Sensor  │ │ Sensor  │ │ Sensor  │
     * └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘
     *      │           │           │           │
     *      └───────────┴─────┬─────┴───────────┘
     *                        ▼
     *               ┌────────────────┐
     *               │  ALARM PANEL   │
     *               │  (result |=)   │
     *               └────────────────┘
     *
     * • ANY sensor triggers → Alarm ON
     * • Alarm STAYS ON until final check
     * • Final: Alarm silent? → All bytes matched ✅
     * }</pre>
     *
     * <h3>Security Guarantee</h3>
     * <pre>{@code
     * ❌ Insecure:              ✅ This method:
     *
     * Mismatch at 0: ~0.1ms    Mismatch at 0: ~0.5ms
     * Mismatch at 5: ~0.3ms    Mismatch at 5: ~0.5ms
     * Mismatch at 31: ~0.5ms   Mismatch at 31: ~0.5ms
     *        ↑                          ↑
     * Time leaks position!      Time reveals NOTHING!
     * }</pre>
     *
     * @param expected the expected hash bytes from storage
     * @param actual the computed hash bytes from user input
     * @return {@code true} if all bytes match, {@code false} otherwise
     */
    private boolean constantTimeEquals(byte[] expected, byte[] actual) {
        if (expected.length != actual.length) {
            return false;
        }

        int result = 0;
        for (int i = 0; i < expected.length; i++) {
            result |= expected[i] ^ actual[i];
        }
        return result == 0;
    }

}
