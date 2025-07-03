import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Task } from './entity/Task';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    //synchronize: true,
    entities: [Task],
    ssl: {
        rejectUnauthorized: false,
    },
});
