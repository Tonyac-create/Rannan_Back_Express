import { AppDataSource } from "./data-source"
import dotenv from "dotenv"
dotenv.config()

import { startServer } from "./app"

export const startServerTest = async () => {

    process.env.HOST_db = '127.0.0.1';
    process.env.PORT_db = '3306';
    process.env.NAME_db = "ms-auth";
    process.env.PASSWORD_db = "mysqlpass";
    process.env.USER_db = "mysqluser";

    return AppDataSource.initialize().then(async () => {

        const app = await startServer();

        // start express server
        app.listen(process.env.PORT)
        console.log(`Express server has started on http://localhost:${process.env.PORT}.`)

        return app;
    }).catch(error => console.log(error))

}
