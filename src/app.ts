
import express from "express"
import * as bodyParser from "body-parser"
import { Request, Response, } from "express"
import { Routes } from "./routes"
import dotenv from "dotenv"
dotenv.config()
import { jwtMiddleware } from "./middleware/jwtMiddleware"
import { jwtRefreshMiddleware } from "./middleware/jwtRefreshMiddleware"
import cors from "cors"


export async function startServer() {

    const app = express()
    app.use(bodyParser.json())

    // Middlewate cors
    app.use(cors({
        origin: 'http://localhost:5173',
        credentials: true,
    }))

    // Intercept for Token check
    app.use("/auth/refreshToken", jwtRefreshMiddleware)
    app.use("/api", jwtMiddleware)


    // register express routes from defined application routes
    Routes.forEach(route => {
        (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next)
            if (result instanceof Promise) {
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined)

            } else if (result !== null && result !== undefined) {
                res.json(result)
            }
        })
    })

    return app;

}


