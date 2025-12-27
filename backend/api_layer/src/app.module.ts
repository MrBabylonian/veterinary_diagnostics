import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ApiAuthModule } from "./api_auth/api.auth.module";

@Module({
    imports: [
        ApiAuthModule,
        ConfigModule.forRoot({
            envFilePath: '../../.env.development',
            isGlobal: true,
        })
    ],
})
export class AppModule { }
