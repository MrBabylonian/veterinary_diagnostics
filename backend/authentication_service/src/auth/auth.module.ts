import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { DatabaseModule } from "@workspace/shared";
import { AuthService } from "./auth.service";

@Module({
	providers: [AuthService],
	imports: [
		DatabaseModule,
		JwtModule.register({
			secret: process.env.JWT_SECRET || "CHANGE_ME_IN_PRODUCTION",
			signOptions: { expiresIn: "72h" },
		}),
	],
	exports: [AuthService],
})
export class AuthModule {}
