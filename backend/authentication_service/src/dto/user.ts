import type { UUID } from 'crypto';
import { PickType } from '@nestjs/mapped-types';
import { IsBoolean, IsEmail, IsEnum, IsISO8601, IsLocale, IsNotEmpty, IsObject, IsOptional, IsPhoneNumber, IsString, IsStrongPassword, IsTimeZone, IsUrl, MinLength } from 'class-validator';
import { Expose } from 'class-transformer';

/**
 * User entity representing a user in the system
 */
export class User {

    id!: UUID;

    @Expose()
    email!: string;

    email_verified_at?: string;

    @Expose()
    phone_number!: string;

    @Expose()
    name!: string;

    @Expose()
    middle_name?: string;

    @Expose()
    last_name!: string;

    password_hash!: string;

    auth_provider!: string;

    auth_subject?: string;

    @Expose()
    mfa_enabled!: boolean;

    last_login_at?: string;

    timezone?: string;

    locale?: string;

    @Expose()
    avatar_url?: string;

    settings!: Record<string, unknown>;
}

/**
 * DTO for public user information
 */
export class UserForPublicDto extends PickType(User, ['email', 'phone_number', 'name', 'middle_name', 'last_name', 'avatar_url']) { }

/**
 * DTO for creating a new user
 */
export class CreateUserDto {

    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsPhoneNumber()
    @IsNotEmpty()
    phone_number!: string;

    @IsString()
    @MinLength(2)
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsOptional()
    middle_name?: string;

    @IsString()
    @MinLength(2)
    @IsNotEmpty()
    last_name!: string;

    @IsStrongPassword()
    @IsNotEmpty()
    password!: string;

    @IsString()
    @IsOptional()
    avatar_url?: string;
}

/**
 * DTO for user login
 */
export class UserForLoginDto extends PickType(CreateUserDto, ['email', 'password']) { }