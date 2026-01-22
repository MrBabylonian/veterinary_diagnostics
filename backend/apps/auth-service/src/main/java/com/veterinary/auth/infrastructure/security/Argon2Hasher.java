package com.veterinary.auth.infrastructure.security;

import de.mkammerer.argon2.Argon2;
import de.mkammerer.argon2.Argon2Factory;

public class Argon2Hasher {
    private static final int ITERATIONS = 3;
    private static final int MEMORY = 65536;
    private static final int PARALLELISM = 4;
    private final Argon2 argon2;

    private static final int MIN_PASSWORD_LENGTH = 12;
    private static final int MAX_PASSWORD_LENGTH = 24;

    public Argon2Hasher() {

        this.argon2 = Argon2Factory.create(
                Argon2Factory.Argon2Types.ARGON2id, 16, 32
            );
    }
    
    public String hash(String password) {
        if (password == null || password.isEmpty()) {
            throw new IllegalArgumentException("Password cannot be null or empty");
        }

        if (password.length() < MIN_PASSWORD_LENGTH || password.length() > MAX_PASSWORD_LENGTH) {
            throw new IllegalArgumentException("Password must be between " + MIN_PASSWORD_LENGTH + " and " + MAX_PASSWORD_LENGTH + " characters long");
        }
            
        return argon2.hash(ITERATIONS, MEMORY, PARALLELISM, password.toCharArray());
    }
    
    public boolean verify(String hash, String password) {
        if (password == null || password.isEmpty()) {
            throw new IllegalArgumentException("Password cannot be null or empty");
        }
        if (hash == null || hash.isEmpty()) {
            throw new IllegalArgumentException("Hash cannot be null or empty");
        }
        return argon2.verify(hash, password.toCharArray());
    }
}
