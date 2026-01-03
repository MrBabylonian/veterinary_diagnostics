import { Module } from "@nestjs/common";
import { DatabaseService } from "./database.service.js";
import { UserRepository } from "./repositories/user.repository.js";

@Module({
	providers: [DatabaseService, UserRepository],
	exports: [DatabaseService, UserRepository],
})
export class DatabaseModule {}
