import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { plainToClass } from 'class-transformer';
import { CreateUserDto, User, UserForPublicDto } from 'src/dto/user';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private usersService: UsersService
    ) { }
    /**
     * Register a user with provided email and password
     * @param email - user's email
     * @param password - user's password
     * @return Promise<User> - the created user
     * @example
     * const newUser = await authService.register('user@example.com', 'password');
     */
    async register(userData: CreateUserDto): Promise<User> {
        /**
         * WORK IN PROGRESS
         */
        const passwordHash = await argon2.hash(userData.password);

        const userToCreate = plainToClass(User, {
            ...userData, password_hash: passwordHash
        }, { excludeExtraneousValues: true });

        return this.usersService.create(userToCreate);
    }
    /**
     * Validate a user with email and password
     * @param email - user's email
     * @param password - user's password
     * @returns Promise<UserForPublic | null> - the validated user or null if invalid
     */
    async validateUser(email: string, password: string): Promise<UserForPublic | null> {
        /**
         * WORK IN PROGRESS
         */
        const userInDb = this.usersService.findByEmail(email);

        if (!userInDb) return null;

        const isValid = await argon2.verify(userInDb.passwordHash, password);

        const user: UserForPublic = {
            id: userInDb.id,
            email: userInDb.email,
        };

        return isValid ? user : null;
    }

    /**
     * 
     * @param email - user's email
     * @param password - user's password
     * @returns Promise<{ token: string; user: UserForPublic; } | null> - JWT token and user info or null if invalid
     */
    async login(email: string, password: string): Promise<{ token: string; user: UserForPublic; } | null> {
        /**
         * WORK IN PROGRESS
         */
        const user = await this.validateUser(email, password);
        if (!user) return null;
        const token = await this.generateToken(user);
        return { token, user };
    }

    /**
     * 
     * @param user : UserForPublic - the user information (id and email)
     * @returns Promise<string> - the generated JWT token
     */

    async generateToken(user: UserForPublic): Promise<string> {
        /**
         * WORK IN PROGRESS
         */
        return this.jwtService.sign({
            sub: user.id,
            email: user.email
        });
    }

    /**
     * 
     * @param token - JWT Token
     * @returns Promise<object | null> - the decoded token payload or null if invalid
     */

    async validateToken(token: string): Promise<object | null> {
        try {
            return this.jwtService.verify(token);
        } catch {
            return null;
        }
    }

}

async function hashTrial(pass: string) {
    return argon2.hash(pass);
}
console.log(hashTrial("password123"));