import express, { Application, urlencoded } from 'express'
import http from 'http'
import cors from 'cors'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import mongoose from "mongoose"
import helmet from 'helmet'

import Controller from '@/interface/controller.interface'
import expressAsyncHandler from 'express-async-handler'
import { errorHandler, notFound } from './handlers/globalError.handler'

class AppModule {
    express: Application
    port: number

    constructor(Controllers: Controller[], port: number) {
        this.express = express()
        this.port = port
        this.express.use(express.json())

        // Middlewares
        this.initDatabase()
        this.initControllers(Controllers)
        this.initMiddlewares()

    }

    private initMiddlewares(): void {
        this.express.use(urlencoded({ extended: false }))
        this.express.use(helmet())
        this.express.use(cors())
        this.express.use(compression())
        this.express.use(cookieParser())
        this.express.all('*', notFound)
        this.express.use(errorHandler)
    }

    private initControllers(controller: Controller[]): void {
        controller.forEach(controller => {
            this.express.use('/', expressAsyncHandler(controller.router))
        })
    }

    private initDatabase() {
        mongoose.set("strictQuery", false);
        mongoose.connect(process.env.MONGO_URL)
            .then(() => console.log('Database connected'))
            .catch((error: Error) => console.log(error))
    }

    listen(): void {
        const server = http.createServer(this.express)
        server.listen(this.port, () => console.log(`Server running on port ${this.port}`))
    }
}

export default AppModule