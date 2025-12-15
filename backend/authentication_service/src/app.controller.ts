import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";

import { AuthService } from "./auth/auth.service";
import { CreateUserDto, UserForLoginDto } from "./dto/user";

@Controller()
export class AppController {
    constructor(private readonly authService: AuthService) { }

    @MessagePattern({ cmd: "auth.register" })
    async register(userData: CreateUserDto) {
        return this.authService.register(userData);
    }

    @MessagePattern({ cmd: "auth.login" })
    async login(credentials: UserForLoginDto) {
        return this.authService.login(credentials);
    }

    @MessagePattern({ cmd: 'auth.validate' })
    async validateToken(payload: { token: string; }) {
        return this.authService.validateToken(payload.token);
    }
}
