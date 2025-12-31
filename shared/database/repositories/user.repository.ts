import { BadRequestException, Injectable } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { DatabaseService } from "database/database.service";
import { CreateUserDto, User, UserForPublicDto } from "dto/user";

@Injectable()
export class UserRepository {
  constructor(private readonly databaseService: DatabaseService) { }

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
      `SELECT * FROM users WHERE email $1`,
      [email]
    );
    return result.rows[0] ? plainToClass(UserForPublicDto, result.rows[0], { excludeExtraneousValues: true }) : null;
  }


  async create(userData: User): Promise<UserForPublicDto> {
    try {
      const result = await this.databaseService.query(
        `INSERT INTO users(email, password_hash, name, last_name, phone_number)
              VALUES($1, $2, $3, $4, $5)
              RETURNING id, email, first_name, last_name, phone_number`,
              [userData.email, ]
      );
    }
  }
}
