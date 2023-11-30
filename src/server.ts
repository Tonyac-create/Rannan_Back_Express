import { AppDataSource } from "./data-source"
import dotenv from "dotenv"
dotenv.config()

import { startServer } from "./app"

AppDataSource.initialize().then(async () => {

    const app = await startServer();

    // start express server
    app.listen(process.env.PORT)
    console.log(`Express server has started on http://localhost:${process.env.PORT}.`)

}).catch(error => console.log(error))
