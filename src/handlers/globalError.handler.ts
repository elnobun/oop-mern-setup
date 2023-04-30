import { NextFunction, Request, Response } from "express"
import APIError from "./apiError.handler";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
    next(new APIError(`Cannot find ${req.originalUrl} on the server`, 404))
}

export const errorHandler = (error: APIError, req: Request, res: Response, next: NextFunction) => {
    error.statusCode = error.statusCode || 500
    // error.status = error.status || 'error'
    res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message
    })

    // if (error instanceof APIError) {
    //     return res.status(error.httpCode).json({
    //         errorCode: error.httpCode
    //     })
    // }

    // return res.status(500).send("Something went wrong")
}
