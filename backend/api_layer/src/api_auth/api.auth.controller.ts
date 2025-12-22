import { Body, Controller, Get, Inject, Post } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { CreateUserDto, UserForLoginDto } from "@workspace/shared/dto/user";

@Controller("auth")
export class ApiAuthController {
	constructor(@Inject("AUTH_SERVICE") private authClient: ClientProxy) {}

	@Post("register")
	async register(@Body() userData: CreateUserDto) {
		return this.authClient.send({ cmd: "auth.register" }, userData);
	}

	@Post("login")
	async login(@Body() credentials: UserForLoginDto) {
		return this.authClient.send({ cmd: "auth.login" }, credentials);
	}

	@Post("validate")
	async validate(@Body() payload: { token: string }) {
		return this.authClient.send({ cmd: "auth.validate" }, payload);
	}

	@Get("test")
	async test() {
		return "Auth service is reachable";
	}
}
