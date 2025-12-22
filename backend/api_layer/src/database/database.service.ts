import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
    private pool!: Pool;

    /**
     * Close the PostgreSQL connection pool when the module is destroyed.
     * This method ensures that all connections in the pool are properly closed
     * to prevent any resource leaks.
     * @returns void
     */
    async onModuleDestroy() {
        await this.pool.end();
    }

    /**
     * Initialize the PostgreSQL connection pool when the module is initialized.
     * This method sets up the connection parameters such as host, port, database name,
     * user, password, and maximum number of connections in the pool.
     * @returns void
     */
    async onModuleInit() {
        this.pool = new Pool({
            host: 'localhost',
            port: 5432,
            database: 'veterinary_diagnostics',
            user: 'vet_user',
            password: 'vet_password',
            max: 10,
        });
    }

    /**
     * Execute a SQL query against the PostgreSQL database.
     * @param text The SQL query text to be executed.
     * @param params Optional parameters for the SQL query.
     * @returns The result of the SQL query.
     */
    async query(text: string, params?: unknown[]) {
        const client = await this.pool.connect();
        try {
            const result = await client.query(text, params);
            return result;
        } finally {
            client.release();
        }
    }
}
