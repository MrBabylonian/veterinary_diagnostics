import {
	BadRequestException,
	ConflictException,
	Injectable,
	InternalServerErrorException,
} from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { CreateUserDto, UserForPublicDto } from "../../dto/user.js";
import { DatabaseService } from "../database.service.js";

@Injectable()
export class UserRepository {
	constructor(private readonly databaseService: DatabaseService) {}

	async findByEmailForAuth(email: string): Promise<string | null> {
		if (!email) throw new BadRequestException("Email must be provided");
		const result = await this.databaseService.query(
			`SELECT * FROM users WHERE email = $1`,
			[email],
		);
		return result.rows[0].password_hash ?? null;
	}

	async findByEmail(email: string) {
		if (!email) throw new BadRequestException("Email must be provided");
		const result = await this.databaseService.query(
			`SELECT * FROM users WHERE email = $1`,
			[email],
		);
		return result.rows[0]
			? plainToClass(UserForPublicDto, result.rows[0], {
					excludeExtraneousValues: true,
				})
			: null;
	}

	async create(
		userData: CreateUserDto,
	): Promise<{ status: number; registeredUser: UserForPublicDto }> {
		if (!userData) throw new BadRequestException("User data must be provided");
		try {
			const result = await this.databaseService.query(
				`INSERT INTO users (id, email, phone_number, name, middle_name, last_name, password_hash, auth_provider, avatar_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id, email, phone_number, name, middle_name, last_name, avatar_url`,
				[
					userData.id,
					userData.email,
					userData.phone_number,
					userData.name,
					userData.middle_name,
					userData.last_name,
					userData.password_hash,
					userData.auth_provider ?? "local",
					userData.avatar_url,
				],
			);
			const registeredUser = plainToClass(UserForPublicDto, result.rows[0], {
				excludeExtraneousValues: true,
			});
			return {
				status: 201,
				registeredUser,
			};
		} catch (error) {
			if (error instanceof Error && "code" in error) {
				if (error.code === "23505") {
					throw new ConflictException(
						"User with this email or phone number already exists",
					);
				}
				throw new InternalServerErrorException(
					`Failed to create user. Error message: ${error.message} Error code: ${error.code}`,
				);
			}
			throw error as Error;
		}
	}
}
