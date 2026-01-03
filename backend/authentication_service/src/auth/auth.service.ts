import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {
  CreateUserDto,
  UserForLoginDto,
  UserForPublicDto,
  UserRepository,
} from "@workspace/shared";
import * as argon2 from "argon2";
import { plainToClass } from "class-transformer";
import { UUID7Generator } from "uuid7-typed";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersRepository: UserRepository,
  ) { }

  /**
   * Register a new user with provided user data
   * @param userData - CreateUserDto containing user registration information
   * @returns Promise<{ status: number; registeredUser: UserForPublicDto; }> - status code and registered user public information
   * @throws {Error} - if user creation fails
   */
  async register(
    userData: CreateUserDto,
  ): Promise<{ status: number; registeredUser: UserForPublicDto; }> {
    const passwordHash = await argon2.hash(userData.password);

    const id = UUID7Generator.create();

    const userToCreate = plainToClass(CreateUserDto, {
      ...userData,
      id,
      password_hash: passwordHash,
    });

    return this.usersRepository.create(userToCreate);
  }

  /**
   * Validate a user's credentials with email and password
   * @param email - user's email address
   * @param password - user's plain text password
   * @returns Promise<{ id: string; email: string; }> - user id and email if valid
   * @throws {NotFoundException} - if user is not found
   * @throws {UnauthorizedException} - if password is invalid
   */
  async validateUser(email: string, password: string) { ; }

  /**
   * Authenticate user and generate JWT token
   * @param credentials - UserForLoginDto containing email and password
   * @returns Promise<string> - JWT access token
   * @throws {NotFoundException} - if user is not found
   * @throws {UnauthorizedException} - if credentials are invalid
   */
  async login(credentials: UserForLoginDto) {
    ;
  }

  /**
   * Generate a JWT token for authenticated user
   * @param sub - user's unique identifier (subject)
   * @param email - user's email address
   * @returns Promise<string> - signed JWT token
   * @throws {Error} - if JWT signing fails (invalid secret or payload)
   */
  async generateToken(sub: string, email: string): Promise<string> {
    return this.jwtService.sign({
      sub,
      email,
    });
  }

  /**
   * Validate and decode a JWT token
   * @param token - JWT token string to validate
   * @returns Promise<object | null> - decoded token payload if valid, null if invalid
   * @throws {Error} - if token verification fails (invalid secret or token)
   */
  async validateToken(token: string): Promise<object | null> {
    try {
      return this.jwtService.verify(token);
    } catch {
      return null;
    }
  }
}
