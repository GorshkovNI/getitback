import { createConnection, Connection } from 'typeorm';

export const connectToDb = async (): Promise<Connection> => {
    const connection = await createConnection({
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "postgres",
        password: "123",
        database: "classified",
        entities: [
            "server/entities/*.ts",
            "server/entities/Token/Token.ts"
        ],
        synchronize: true,
    });

    return connection;
};