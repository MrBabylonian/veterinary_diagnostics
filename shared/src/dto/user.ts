import { PickType } from "@nestjs/mapped-types";
import { Expose } from "class-transformer";
import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsPhoneNumber,
	IsString,
	IsStrongPassword,
	IsUrl,
	MinLength,
} from "class-validator";
import { type UUID7 } from "uuid7-typed";
import { AuthProvider } from "./auth.provider.js";

/**
 * User entity representing a user in the systems
 */
export class User {
	@Expose()
	id!: UUID7;

	@Expose()
	email!: string;

	email_verified_at?: Date;

	@Expose()
	phone_number!: string;

	@Expose()
	name!: string;

	@Expose()
	middle_name?: string;

	@Expose()
	last_name!: string;

	password_hash!: string;

	auth_provider: AuthProvider = "local";

	auth_subject?: string;

	mfa_enabled?: boolean;

	last_login_at?: string;

	timezone?: string;

	locale?: string;

	@Expose()
	avatar_url?: string;

	settings?: Record<string, unknown>;

	created_at!: Date;

	updated_at!: Date;

	deleted_at?: Date;
}

/**
 * DTO for public user information
 */
export class UserForPublicDto extends PickType(User, [
	"id",
	"email",
	"phone_number",
	"name",
	"middle_name",
	"last_name",
	"avatar_url",
]) {}

/**
 * DTO for creating a new user
 */
export class CreateUserDto {
	@IsNotEmpty()
	id!: UUID7;

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

	@IsNotEmpty()
	@IsStrongPassword()
	password!: string;

	@IsNotEmpty()
	password_hash!: string;

	@IsString()
	@IsNotEmpty()
	auth_provider: AuthProvider = "local";

	@IsUrl()
	@IsOptional()
	avatar_url?: string;
}

/**
 * DTO for user login
 */
export class UserForLoginDto {
	@IsEmail()
	@IsNotEmpty()
	email!: string;

	@IsStrongPassword()
	@IsNotEmpty()
	password!: string;
}
