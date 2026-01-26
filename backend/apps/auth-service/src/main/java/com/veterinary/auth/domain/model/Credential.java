package com.veterinary.auth.domain.model;


import auth.Auth.AuthProvider;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

/**
 * The core domain entity representing a user's authentication credentials.
 *
 * <p>
 * This class maps directly to the {@code credentials} table in the database and serves
 * as the central piece of our authentication domain. It's designed to be immutable,
 * meaning once created, you can't change its fields directly. Instead, you create
 * modified copies using the {@code toBuilder()} pattern.</p>
 *
 * <h2>Why Immutability?</h2>
 * <p>
 * In a concurrent, reactive environment (like Quarkus with Mutiny), mutable objects
 * can cause subtle bugs when multiple threads access the same instance. Immutable
 * objects are inherently thread-safe because their state never changes after creation.</p>
 *
 * <pre>{@code
 * // Instead of this (mutable, dangerous):
 * credential.setLastLoginAt(Instant.now());  // ❌ Could cause race conditions
 *
 * // We do this (immutable, safe):
 * Credential updated = credential.withLastLogin(Instant.now());  // ✅ New instance
 * }</pre>
 *
 * <h2>Database Mapping</h2>
 * <pre>
 * ┌─────────────────────┬────────────────────┬─────────────────────────────────┐
 * │ Java Field          │ DB Column          │ Notes                           │
 * ├─────────────────────┼────────────────────┼─────────────────────────────────┤
 * │ id                  │ id                 │ UUIDv7, primary key             │
 * │ email               │ email              │ Unique, case-insensitive        │
 * │ passwordHash        │ password_hash      │ Argon2id hash, null for OAuth   │
 * │ authProvider        │ auth_provider      │ 'local', 'google', 'azuread'    │
 * │ authSubject         │ auth_subject       │ OAuth provider's user ID        │
 * │ mfaEnabled          │ mfa_enabled        │ Two-factor auth toggle          │
 * │ status              │ status             │ 'active', 'suspended', 'deleted'│
 * │ emailVerifiedAt     │ email_verified_at  │ When email was confirmed        │
 * │ lastLoginAt         │ last_login_at      │ Audit trail                     │
 * │ createdAt           │ created_at         │ Account creation timestamp      │
 * │ updatedAt           │ updated_at         │ Last modification timestamp     │
 * │ deletedAt           │ deleted_at         │ Soft delete timestamp           │
 * └─────────────────────┴────────────────────┴─────────────────────────────────┘
 * </pre>
 *
 * <h2>Usage Examples</h2>
 *
 * <h3>Creating a new local credential (registration)</h3>
 * <pre>{@code
 * Credential credential = Credential.builder()
 *     .id(UuidV7.generate())
 *     .email("user@example.com")
 *     .passwordHash(argon2Hasher.hash("securePassword123"))
 *     .authProvider(AuthProvider.LOCAL)
 *     .build()
 *     .validate();  // Always validate after building!
 * }</pre>
 *
 * <h3>Creating an OAuth credential (Google sign-in)</h3>
 * <pre>{@code
 * Credential credential = Credential.builder()
 *     .id(UuidV7.generate())
 *     .email("user@gmail.com")
 *     .authProvider(AuthProvider.GOOGLE)
 *     .authSubject("google-oauth-subject-id-12345")
 *     .emailVerifiedAt(Instant.now())  // Google already verified the email
 *     .build()
 *     .validate();
 * }</pre>
 *
 * <h3>Updating after successful login</h3>
 * <pre>{@code
 * Credential updated = existingCredential.withLastLogin(Instant.now());
 * repository.update(updated);
 * }</pre>
 *
 * <h2>Thread Safety</h2>
 * <p>
 * This class is fully thread-safe due to immutability. All fields are final,
 * and modification methods return new instances.</p>
 *
 * @author Auth Service Team
 * @see AuthProvider
 * @see CredentialStatus
 */
@Getter
@Builder(toBuilder = true)
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = "passwordHash")
public class Credential {

  /**
   * The unique identifier for this credential (UUIDv7).
   *
   * <p>
   * We use UUIDv7 instead of UUIDv4 because UUIDv7 is time-ordered, which means:
   * <ul>
   *   <li>Database indexes are more efficient (sequential inserts)</li>
   *   <li>You can roughly sort by creation time just by sorting IDs</li>
   *   <li>No need for a separate auto-increment column</li>
   * </ul>
   * </p>
   *
   * <p>This is the only field used for {@code equals()} and {@code hashCode()}
   * because two credentials with the same ID are the same entity, regardless
   * of other field differences (which would indicate stale data).</p>
   */
  @EqualsAndHashCode.Include
  private final UUID id;

  /**
   * The user's email address, used as the login identifier.
   *
   * <p>
   * Always stored in lowercase to ensure case-insensitive uniqueness.
   * The database has a unique constraint on this column.</p>
   */
  private final String email;


  /**
   * The Argon2id password hash, or {@code null} for OAuth users.
   *
   * <p>
   * This field is excluded from {@code toString()} to prevent accidental
   * logging of sensitive data. Even though it's a hash (not the actual password),
   * it's still sensitive because an attacker with the hash could attempt
   * offline brute-force attacks.</p>
   *
   * <p>The hash format follows the PHC (Password Hashing Competition) standard:</p>
   * <pre>{@code $argon2id$v=19$m=65536,t=3,p=4$<salt>$<hash>}</pre>
   */
  private final String passwordHash;

  @Builder.Default
  private final AuthProvider authProvider = AuthProvider.LOCAL;

  /**
   * The external provider's unique identifier for this user.
   *
   * <p>
   * For example, Google's "sub" claim from the ID token. This is {@code null}
   * for local authentication and required for OAuth providers.</p>
   *
   * <p>Combined with {@code authProvider}, this forms a unique index for
   * fast OAuth login lookups.</p>
   */
  private final String authSubject;

  /**
   * Whether multi-factor authentication is enabled.
   * Defaults to {@code false} for new accounts.
   */
  @Builder.Default
  private final boolean mfaEnabled = false;

  /**
   * The account's current status, controlling whether login is allowed.
   * Defaults to {@code ACTIVE} for new accounts.
   *
   * @see CredentialStatus
   */
  @Builder.Default
  private final CredentialStatus status = CredentialStatus.ACTIVE;

  /**
   * When the user verified their email address, or {@code null} if unverified.
   *
   * <p>
   * For OAuth users, this is typically set immediately since the OAuth provider
   * has already verified the email. For local users, this is set when they
   * click the verification link.</p>
   */
  private final Instant emailVerifiedAt;

  /**
   * When the user last successfully logged in.
   *
   * <p>
   * Useful for security auditing, detecting inactive accounts, and showing
   * "last seen" information. Updated on every successful login.</p>
   */
  private final Instant lastLoginAt;

  /**
   * When this credential was created. Set automatically if not provided.
   */
  private final Instant createdAt;

  /**
   * When this credential was last modified. Updated on any change.
   */
  private final Instant updatedAt;

  /**
   * When this credential was soft-deleted, or {@code null} if active.
   *
   * <p>
   * Soft deletion means the record stays in the database but is filtered out
   * of normal queries. This allows for account recovery and audit trails.</p>
   */
  private final Instant deletedAt;


  // ──────────────────────────────────────────────────────────────────────────
  // Validation
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Validates that this credential satisfies all domain invariants.
   *
   * <p>
   * Call this method after building a new credential to ensure it's in a
   * valid state. The builder pattern doesn't enforce all our business rules,
   * so explicit validation is necessary.</p>
   *
   * <h3>Invariants Checked</h3>
   * <ul>
   *   <li>ID must not be null</li>
   *   <li>Email must not be null or blank</li>
   *   <li>For LOCAL auth: password hash is required</li>
   *   <li>For OAuth auth: auth subject is required</li>
   * </ul>
   *
   * <h3>Why a Separate Method?</h3>
   * <p>
   * Lombok's {@code @Builder} can't run custom validation logic. We could use
   * a custom builder, but that defeats the purpose of using Lombok. Instead,
   * we chain {@code .validate()} after {@code .build()}:</p>
   *
   * <pre>{@code
   * Credential cred = Credential.builder()
   *     .id(id)
   *     .email(email)
   *     .passwordHash(hash)
   *     .build()
   *     .validate();  // Throws if invalid
   * }</pre>
   *
   * @return this credential (for method chaining)
   * @throws NullPointerException     if required fields are null
   * @throws IllegalArgumentException if business rules are violated
   */
  public Credential validate() {
    // Null checks for required fields
    Objects.requireNonNull(id, "Credential ID cannot be null");
    Objects.requireNonNull(email, "Email cannot be null");
    Objects.requireNonNull(authProvider, "Auth provider cannot be null");
    Objects.requireNonNull(status, "Status cannot be null");

    if (email.isBlank()) {
      throw new IllegalArgumentException("Email cannot be blank");

    }
    if (authProvider == AuthProvider.LOCAL) {
      if (passwordHash == null || passwordHash.isBlank()) {
        throw new IllegalArgumentException("Password hash is required for " +
            "LOCAL authentication");
      }
    }

    if (authProvider != AuthProvider.LOCAL) {
      if (authSubject == null || authSubject.isBlank()) {
        throw new IllegalArgumentException("Auth subject is required for " +
            "OAuth authentication");
      }
    }

    return this;  // For method chaining (optional)
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Domain Logic (Query Methods)
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Checks whether this credential can be used to log in.
   *
   * <p>
   * A credential is usable for login only if:
   * <ul>
   *   <li>Status is {@code ACTIVE} (not suspended or deleted)</li>
   *   <li>Not soft-deleted ({@code deletedAt} is null)</li>
   * </ul>
   * </p>
   *
   * <h3>Usage</h3>
   * <pre>{@code
   * if (!credential.canLogin()) {
   *     throw new AccountSuspendedException();
   * }
   * // Proceed with password verification...
   * }</pre>
   *
   * @return true if login is allowed
   */
  public boolean canLogin() {
    return status == CredentialStatus.ACTIVE && deletedAt == null;
  }

  /**
   * Checks whether the user has verified their email address.
   *
   * <p>
   * Some features might be restricted until email verification is complete.
   * For OAuth users, this is typically true from the start.</p>
   *
   * @return true if email has been verified
   */
  public boolean isEmailVerified() {
    return emailVerifiedAt != null;
  }

  /**
   * Checks whether this credential uses local (email/password) authentication.
   *
   * @return true if this is a local credential
   */
  public boolean isLocalAuth() {
    return authProvider == AuthProvider.LOCAL;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Domain Logic (Mutation Methods - Return New Instances)
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Creates a copy of this credential with an updated last login timestamp.
   *
   * <p>
   * Call this after successful authentication to record the login event.
   * Also updates {@code updatedAt} automatically.</p>
   *
   * <h3>Example</h3>
   * <pre>{@code
   * // After verifying password:
   * Credential updated = credential.withLastLogin(Instant.now());
   * repository.update(updated);
   * }</pre>
   *
   * @param loginTime when the login occurred (typically {@code Instant.now()})
   * @return a new Credential instance with updated timestamps
   */
  public Credential withLastLogin(Instant loginTime) {
    return this.toBuilder()
        .lastLoginAt(loginTime)
        .updatedAt(Instant.now())
        .build();
  }

  /**
   * Creates a soft-deleted copy of this credential.
   *
   * <p>
   * Soft deletion preserves the record for audit purposes while preventing
   * login. The account can potentially be recovered by an administrator.</p>
   *
   * <h3>What Gets Changed</h3>
   * <ul>
   *   <li>{@code status} → {@code DELETED}</li>
   *   <li>{@code deletedAt} → current timestamp</li>
   *   <li>{@code updatedAt} → current timestamp</li>
   * </ul>
   *
   * @return a new Credential instance marked as deleted
   */
  public Credential asSoftDeleted(){
    return this.toBuilder()
        .status(CredentialStatus.DELETED)
        .deletedAt(Instant.now())
        .updatedAt(Instant.now())
        .build();
  }

  /**
   * Creates a copy with the email marked as verified.
   *
   * <p>
   * Call this when the user clicks the email verification link.</p>
   *
   * @return a new Credential instance with verified email
   */
  public Credential withVerifiedEmail() {
    return this.toBuilder()
        .emailVerifiedAt(Instant.now())
        .updatedAt(Instant.now())
        .build();
  }

  /**
   * Creates a copy with an updated password hash.
   *
   * <p>
   * Use this for password changes or when rehashing with updated parameters.
   * The caller is responsible for hashing the new password before calling this.</p>
   *
   * <h3>Example</h3>
   * <pre>{@code
   * String newHash = argon2Hasher.hash(newPassword);
   * Credential updated = credential.withPasswordHash(newHash);
   * repository.update(updated);
   * }</pre>
   *
   * @param newPasswordHash the new Argon2id hash (not the plain password!)
   * @return a new Credential instance with the updated hash
   */
  public Credential withPasswordHash(String newPasswordHash) {
    return this.toBuilder()
        .passwordHash(newPasswordHash)
        .updatedAt(Instant.now())
        .build();
  }

  public Credential asSuspended() {
    return this.toBuilder()
        .status(CredentialStatus.SUSPENDED)
        .updatedAt(Instant.now())
        .build();
  }

  /**
   * Creates a reactivated copy of this credential.
   *
   * <p>
   * Restores a suspended or soft-deleted account to active status.</p>
   *
   * @return a new Credential instance with active status
   */
  public Credential asReactivated() {
    return this.toBuilder()
        .status(CredentialStatus.ACTIVE)
        .deletedAt(null)
        .updatedAt(Instant.now())
        .build();
  }
}

