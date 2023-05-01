import { NextFunction, Request, Response } from "express"
import APIError, { HttpStatusCode } from "./apiError.handler";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
    next(new APIError(`Cannot find ${req.originalUrl} on the server`, HttpStatusCode.NOT_FOUND))
}

const validationErrorHandler = (error: any) => {
    const errors = Object.values(error.errors).map(value => value)
    const errorMessages = errors.join('. ')
    const message = `Invalid input data: ${errorMessages}`

    return new APIError(message, HttpStatusCode.BAD_REQUEST)
}

const devErrors = (res: Response, error: APIError) => {
    return res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
        stackTrace: error.stack,
        error: error
    })
}

const productionError = (res: Response, error: APIError) => {
    if (error.isOperational) {
        return res.status(error.statusCode).json({
            status: error.statusCode,
            message: error.message
        })
    } else {
        return res.status(HttpStatusCode.INTERNAL_SERVER).json({
            status: 'error',
            message: 'Something went wrong! please try again.'
        })
    }
}

export const errorHandler = (error: APIError, req: Request, res: Response, next: NextFunction) => {
    error.statusCode = error.statusCode || HttpStatusCode.INTERNAL_SERVER
    error.status = error.status || 'error'
    if (process.env.NODE_ENV === 'development') {
        devErrors(res, error)
    } else if (process.env.NODE_ENV === 'production') {
        if (error.name === 'ValidationError') error = validationErrorHandler(error)
    }

    return productionError(res, error)
}
