import { Controller, Get } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { AppService } from "./app.service";
import { AuthService } from "./auth/auth.service";

@Controller()
export class AppController {
    constructor(private readonly authService: AuthService) { }

}
