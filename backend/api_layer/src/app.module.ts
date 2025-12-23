import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ApiAuthModule } from "./api_auth/api.auth.module";
import { DatabaseModule } from "./database/database.module";
@Module({
    imports: [
        ApiAuthModule,
        DatabaseModule,
        ConfigModule.forRoot({
            envFilePath: '../../.env.development',
            isGlobal: true,
        })
    ],
})
export class AppModule { }
