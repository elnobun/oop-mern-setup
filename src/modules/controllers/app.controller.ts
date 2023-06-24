import { Router } from "express"
import { Request, Response, NextFunction } from "express";
import AppService from "../services/app.service";

export default class AppController {
    path = "/api"
    router = Router()

    // instantiate new service call
    private appService = new AppService()

    constructor() {
        this.routes()
    }

    routes() {
        this.router.get(`${this.path}/`, this.appService.home)
    }

}
