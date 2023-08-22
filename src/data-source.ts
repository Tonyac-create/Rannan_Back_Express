import "reflect-metadata"
import { DataSource } from "typeorm"


export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "user",
    password: "password",
    database: "typeorm_db",
    synchronize: true,
    logging: false,
    entities: ["./src/entity/*{.ts,.js}"],
    migrations: [],
    subscribers: [],
})
