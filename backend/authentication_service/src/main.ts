import { NestFactory } from "@nestjs/core";
import { Transport } from "@nestjs/microservices";
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const _tcpService = app.connectMicroservice({
        transport: Transport.TCP,
        options: {
            host: '0.0.0.0',
            port: Number(process.env.TCP_PORT ?? 8877),
        }
    });

    const _kafkaService = app.connectMicroservice({
        transport: Transport.KAFKA,
        options: {
            client: { brokers: (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(',') },
            consumer: { groupId: process.env.KAFKA_GROUP_ID ?? 'authentication-service-group' }
        },
    });

    await app.startAllMicroservices();
    await app.init();
    console.log("Authentication microservice started (TCP + Kafka)");
}
bootstrap();
