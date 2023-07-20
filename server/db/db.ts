import {createConnection, Connection, DataSource} from 'typeorm';

    export const AppDataSource =  new DataSource({
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "postgres",
        password: "123",
        database: "classified",
        entities: [
            "server/entities/*.ts",
            "server/entities/**/*.ts",
            // "server/entities/Token/Token.ts",
            // "server/entities/Ad/Ads.ts",
            // "server/entities/Photo/Photos.ts"
        ],
        synchronize: true,
    });
