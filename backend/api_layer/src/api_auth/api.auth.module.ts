import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ApiAuthController } from "./api.auth.controller";

@Module({
	imports: [
		ClientsModule.register([
			{
				name: "AUTH_SERVICE",
				transport: Transport.TCP,
				options: {
					host: process.env.AUTH_SERVICE_TCP_HOST || "localhost",
					port: Number(process.env.AUTH_SERVICE_TCP_PORT || 8877),
				},
			},
		]),
	],
	controllers: [ApiAuthController],
})
export class ApiAuthModule {}
