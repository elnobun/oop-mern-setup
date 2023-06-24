import { NextFunction, Request, Response } from "express"

export default class AppService {
    // bring in your model here
    constructor() { }

    home = (req: Request, res: Response, next: NextFunction) => {
        res.json({
            status: "success",
            message: "Application is ready for use. Enjoy! ✨ "
        })
    }
}
