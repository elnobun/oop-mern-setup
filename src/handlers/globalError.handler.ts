import { NextFunction, Request, Response } from "express"
import APIError from "./apiError.handler";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
    next(new APIError(`Cannot find ${req.originalUrl} on the server`, 404))
}

const validationErrorHandler = (error: any) => {
    const errors = Object.values(error.errors).map(value => value)
    const errorMessages = errors.join('. ')
    const message = `Invalid input data: ${errorMessages}`

    return new APIError(message, 400)
}

const productionError = (res: Response, error: APIError) => {
    if (error.isOperational) {
        return res.status(error.statusCode).json({
            status: error.statusCode,
            message: error.message
        })
    } else {
        return res.status(500).json({
            status: 'error',
            message: 'Something went wrong! pleasse try again.'
        })
    }
}

export const errorHandler = (error: APIError, req: Request, res: Response, next: NextFunction) => {
    error.statusCode = error.statusCode || 500
    error.status = error.status || 'error'
    if (error.name === 'ValidationError') {
        console.log("hello");

        error = validationErrorHandler(error)
    }

    return productionError(res, error)
}
