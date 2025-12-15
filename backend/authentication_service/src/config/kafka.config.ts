/**
 * Get Kafka brokers from environment variable or default value.
 * @param kafkaUrl Optional Kafka URL string.
 * @returns Array of Kafka broker addresses from environment variable or default to ['localhost:9092'].
 */
function getKafkaBrokers(kafkaUrl: string | undefined = undefined): Array<string> {
    return (process.env.KAFKA_BROKERS || kafkaUrl)
        ?.split(',')
        .map(broker => broker.trim())
        .filter(broker => broker.length > 0)
        || ['localhost:9092'];
};

export { getKafkaBrokers };