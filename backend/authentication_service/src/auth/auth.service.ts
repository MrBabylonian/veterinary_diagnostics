import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
     * Register a new user with provided user data
     * @param userData - CreateUserDto containing user registration information
     * @returns Promise<{ status: number; registeredUser: UserForPublicDto; }> - status code and registered user public information
     * @throws {Error} - if user creation fails
     */
    async register(userData: CreateUserDto): Promise<{ status: number; registeredUser: UserForPublicDto; }> {

        const passwordHash = await argon2.hash(userData.password);

        const userToCreate = plainToClass(User, {
            ...userData, password_hash: passwordHash
        }, { excludeExtraneousValues: true });

        return this.usersService.create(userToCreate);
    }

    /**
     * Validate a user's credentials with email and password
     * @param email - user's email address
     * @param password - user's plain text password
     * @returns Promise<{ id: string; email: string; }> - user id and email if valid
     * @throws {NotFoundException} - if user is not found
     * @throws {UnauthorizedException} - if password is invalid
     */
    async validateUser(email: string, password: string): Promise<{ id: string; email: string; }> {
        const userInDb = this.usersService.findByEmailForValidation(email);

        const isValid = await argon2.verify(userInDb.password_hash, password);

        if (!isValid) throw new UnauthorizedException('Invalid password');

        const user = {
            id: userInDb.id,
            email: userInDb.email,
        };

        return user;
    }

    /**
     * Authenticate user and generate JWT token
     * @param email - user's email address
     * @param password - user's plain text password
     * @returns Promise<string> - JWT access token
     * @throws {NotFoundException} - if user is not found
     * @throws {UnauthorizedException} - if credentials are invalid
     */
    async login(email: string, password: string): Promise<string> {
        const user = await this.validateUser(email, password);

        const token = await this.generateToken(user.id, user.email);
        
        return token;
    }

    /**
     * Generate a JWT token for authenticated user
     * @param sub - user's unique identifier (subject)
     * @param email - user's email address
     * @returns Promise<string> - signed JWT token
     */
    async generateToken(sub: string, email: string): Promise<string> {
        return this.jwtService.sign({
            sub,
            email
        });
    }

    /**
     * Validate and decode a JWT token
     * @param token - JWT token string to validate
     * @returns Promise<object | null> - decoded token payload if valid, null if invalid
     */

    async validateToken(token: string): Promise<object | null> {
        try {
            return this.jwtService.verify(token);
        } catch {
            return null;
        }
    }

}

