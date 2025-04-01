import { Pool, QueryConfig, QueryResult, PoolClient, QueryResultRow } from "pg";
import {Keys} from "../keys";

class Database {
    private pool: Pool;

    constructor() {
        this.pool = new Pool({
            host: Keys.Database.Host,
            port: parseInt(Keys.Database.Port),
            user: Keys.Database.Username,
            password: Keys.Database.Password,
            database: Keys.Database.Database,
            ssl: {
              rejectUnauthorized: false
            },
            
        });
    }

    async query<T extends QueryResultRow>(
        queryText: string,
        values?: (string | number | boolean | null | Date)[]
      ): Promise<QueryResult<T>> {
        try {
          const result = await this.pool.query<T>(queryText, values);
          return result;
        } catch (err) {
          throw err;
        }
      }
    
      async queryWithConfig<T extends QueryResultRow>(
        queryConfig: QueryConfig
      ): Promise<T[]> {
        try {
          const result = await this.pool.query<T>(queryConfig);
          return result.rows;
        } catch (err) {
          throw err;
        }
      }
    
      async setSchema(client: PoolClient, schemaName: string): Promise<void> {
        await client.query(`SET search_path TO ${schemaName}`);
      }
    
      async setUserContext(client: PoolClient, userId: string): Promise<void> {
        await client.query(`SET app.current_user_id TO $1`, [userId]);
      }
    
      async beginTransaction(client: PoolClient): Promise<void> {
        await client.query("BEGIN");
      }
    
      async commitTransaction(client: PoolClient): Promise<void> {
        await client.query("COMMIT");
      }
    
      async rollbackTransaction(client: PoolClient): Promise<void> {
        await client.query("ROLLBACK");
      }
    
      async getClient(): Promise<PoolClient> {
        return this.pool.connect();
      }
    
      async close(): Promise<void> {
        await this.pool.end();
      }
}

export { Database };