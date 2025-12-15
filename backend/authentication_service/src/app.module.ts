import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";

@Module({
    imports: [
        ClientsModule.register([
            {
                name: "KAFKA_PRODUCER",
                transport: Transport.KAFKA,
                options: {
                    client: { brokers: (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(',') }
                }
            }
        ]),
        UsersModule,
        AuthModule
    ],
    controllers: [AppController],
})
export class AppModule { }
