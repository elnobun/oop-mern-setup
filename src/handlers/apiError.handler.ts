export enum HttpStatusCode {
    // Client Error
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    // Server Error
    INTERNAL_SERVER = 500,
}

class APIError extends Error {
    public statusCode: HttpStatusCode
    public status: string
    public isOperational: boolean

    constructor(message: string, statusCode: HttpStatusCode,) {
        super(message)
        this.statusCode = statusCode
        this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error'

        this.isOperational = true

        Error.captureStackTrace(this, this.constructor)

    }
}

export default APIError