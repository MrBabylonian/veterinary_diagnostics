import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { getKafkaBrokers } from "./config/kafka.config";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '../../.env.development',
            isGlobal: true,
        }),
        ClientsModule.register([
            {
                name: "KAFKA_PRODUCER",
                transport: Transport.KAFKA,
                options: {
                    client: { brokers: getKafkaBrokers() },
                },
            },
        ]),
        AuthModule,
    ],
    controllers: [AppController],
})
export class AppModule { }
