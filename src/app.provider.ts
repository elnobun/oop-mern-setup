import express, { Application, urlencoded } from 'express'
import http from 'http'
import cors from 'cors'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import mongoose, { MongooseError } from "mongoose"
import helmet from 'helmet'

import Controller from '@/interface/controller.interface'
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
        this.express.all('*', notFound)
        this.express.use(errorHandler)
        this.express.use(helmet())
        this.express.use(cors())
        this.express.use(compression())
        this.express.use(cookieParser())

    }

    private initControllers(controller: Controller[]): void {
        controller.forEach(controller => {
            this.express.use('/', controller.router)
        })
    }

    private async initDatabase() {
        mongoose.set("strictQuery", false);
        try {
            await mongoose.connect(process.env.MONGO_URL)
            console.log('Database connected')
        } catch (error) {
            throw error
        }

        mongoose.connection.on("disconnected", () => {
            console.log("MongoDB disconnected!");
        })

        mongoose.connection.on("connected", () => {
            console.log("MongoDB connected!");

        })

    }

    listen(): void {
        const server = http.createServer(this.express)
        server.listen(this.port, () => console.log(`Server running on port ${this.port}`))

        process.on('unhandledRejection', (error: MongooseError) => {
            console.log(error.name, error.message);
            console.log('Unhandled Rejection! server shutting down...');
            server.close(() => {
                process.exit(1)
            })
        })
    }
}

export const AppProvider = AppModule
