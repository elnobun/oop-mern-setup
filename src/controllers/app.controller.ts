import { Router } from "express"
import { Request, Response, NextFunction } from "express";

export default class AppController {
    path = "/api/v1"
    router = Router()

    // instantiate new service call

    constructor() {
        this.routes()
    }

    routes() {
        this.router.get(`${this.path}/`, this.home)
    }
    private home = (req: Request, res: Response, next: NextFunction) => {
        res.json({
            status: "success",
            message: "Application is ready for use. Enjoy! ✨ "
        })
    }
}