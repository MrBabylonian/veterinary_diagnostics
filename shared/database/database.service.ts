import { Injectable, InternalServerErrorException, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
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
    const requiredEnvVars = ["POSTGRES_HOST", "POSTGRES_PORT", "POSTGRES_DATABASE", "POSTGRES_USER", "POSTGRES_DATABASE_PASSWORD"];

    // Iterate over requiredEnvVars and collect those that are missing in process.env
    const missingEnvVars = requiredEnvVars.filter
      (varName => !process.env[varName]);

    if (missingEnvVars.length > 0) {
      throw new InternalServerErrorException(
        `Missing required environment variables ${missingEnvVars.join(', ')}`
      );
    }
    this.pool = new Pool({
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      database: process.env.POSTGRES_DATABASE,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_DATABASE_PASSWORD,
      max: 10,
    });

    try {
      // Validate the connection on startup
      const client = await this.pool.connect();
      await client.query('SELECT 1');
      client.release();
    }
    catch (error) {
      await this.pool.end();
      const message = error instanceof Error ? error.message : String(error);
      throw new InternalServerErrorException(
        `Initial connection to PostgreSQL database failed ${message}`
      );
    }
  }

  /**
   * Execute a SQL query against the PostgreSQL database.
   * @param text The SQL query text to be executed.
   * @param params Optional parameters for the SQL query.
   * @returns The result of the SQL query.
   */
  async query(text: string, params: string[]) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  }
}
