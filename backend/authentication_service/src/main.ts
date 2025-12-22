import { NestFactory } from "@nestjs/core";
import { Transport } from "@nestjs/microservices";
import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const _tcpService = app.connectMicroservice({
		transport: Transport.TCP,
		options: {
			host: process.env.AUTH_SERVICE_TCP_HOST,
			port: Number(process.env.AUTH_SERVICE_TCP_PORT ?? 8877),
		},
	});

	// TODO:
	// const _kafkaService = app.connectMicroservice({
	//     transport: Transport.KAFKA,
	//     options: {
	//         client: { brokers: getKafkaBrokers() },
	//         consumer: { groupId: process.env.KAFKA_GROUP_ID ?? 'authentication-service-group' }
	//     },
	// });

	await app.startAllMicroservices();
	await app.init();
	console.log("Authentication microservice started (TCP + Kafka)");
}
bootstrap();
