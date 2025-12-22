import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { getKafkaBrokers } from "./config/kafka.config";
import { UsersModule } from "./users/users.module";

@Module({
    imports: [
        ClientsModule.register([
            {
                name: "KAFKA_PRODUCER",
                transport: Transport.KAFKA,
                options: {
                    client: { brokers: getKafkaBrokers() },
                },
            },
        ]),
        UsersModule,
        AuthModule,
    ],
    controllers: [AppController],
})
export class AppModule { }
