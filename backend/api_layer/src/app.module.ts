import { Module } from "@nestjs/common";
import { ApiAuthModule } from "./api_auth/api.auth.module";
import { DatabaseService } from './database/database.service';
import { DatabaseModule } from './database/database.module';
@Module({
	imports: [ApiAuthModule, DatabaseModule],
	providers: [DatabaseService],
})
export class AppModule {}
