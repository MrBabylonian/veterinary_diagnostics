import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { getKafkaBrokers } from "./config/kafka.config";

@Module({
    imports: [
        ClientsModule.register([
            {
                name: "KAFKA_PRODUCER",
                transport: Transport.KAFKA,
                options: {
                    client: { brokers: getKafkaBrokers() }
                }
            }
        ]),
        UsersModule,
        AuthModule
    ],
    controllers: [AppController],
})
export class AppModule { }
