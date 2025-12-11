import { IsBoolean, IsEmail, IsEnum, IsISO8601, IsJSON, IsLocale, IsNotEmpty, IsObject, IsOptional, IsPhoneNumber, IsString, IsStrongPassword, IsTimeZone, IsUrl, MinLength } from 'class-validator';
import type { UUID } from 'crypto';
import { PickType } from '@nestjs/mapped-types';


export class User {
    @IsString()
    @IsNotEmpty()
    id!: UUID;

    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsISO8601({ strict: true })
    @IsOptional()
    email_verified_at: string | undefined = undefined;

    @IsPhoneNumber()
    @IsNotEmpty()
    phone_number!: string;

    @IsString()
    @MinLength(2)
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsOptional()
    middle_name: string | undefined = undefined;

    @IsString()
    @MinLength(2)
    @IsNotEmpty()
    last_name!: string;

    @IsString()
    @IsOptional()
    password_hash: string | undefined;

    @IsEnum(['local', 'google', 'microsoft', 'apple'])
    auth_provider: string = 'local';

    @IsString()
    @IsOptional()
    auth_subject: string | undefined;

    @IsBoolean()
    @IsNotEmpty()
    mfa_enabled: boolean = false;

    @IsISO8601({ strict: true })
    @IsOptional()
    last_login_at: string | undefined = undefined;

    @IsTimeZone()
    @IsOptional()
    timezone: string | undefined;

    @IsLocale()
    @IsOptional()
    locale: string | undefined;

    @IsUrl()
    @IsOptional()
    avatar_url: string | undefined;

    @IsObject()
    settings: Record<string, any> = {};
}

export class UserForPublicDto extends PickType(User, ['id', 'email', 'name', 'middle_name', 'last_name', 'avatar_url']) { }

export class CreateUserDto extends PickType(User, ['email', 'phone_number', 'name', 'middle_name', 'last_name', 'auth_provider', 'auth_subject', 'timezone', 'locale', 'avatar_url', 'settings']) {

    @IsStrongPassword()
    @IsNotEmpty()
    password!: string;
}

export class UserForLoginDto extends PickType(CreateUserDto, ['email', 'password']) { }
