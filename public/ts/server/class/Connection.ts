import { Pool } from 'pg';

export class Connection {
    private POOL: Pool;

    constructor(HOST: string, PORT: string, DATABASE: string, USER: string, PASSWORD: string, Pool: any) {
        this.POOL = new Pool({
            host: HOST,
            port: PORT,
            database: DATABASE,
            user: USER,
            password: PASSWORD,
        });
    }

    async connect(): Promise<void> {
        try {
            const client = await this.POOL.connect();

            await client.query('SELECT 1');
            console.log('Connexion réussie à la base de données');
            // Libération du client
            client.release();
        } catch (error) {
            console.log('Connexion échouée à la base de données');
            throw error;
        }
    }

    public getPool() {
        return this.POOL;
    }
}
