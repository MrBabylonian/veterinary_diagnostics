import { Module } from "@nestjs/common";
import { ApiAuthModule } from "./api_auth/api.auth.module";
@Module({
    imports: [
        ApiAuthModule
    ],
})
export class AppModule { }
