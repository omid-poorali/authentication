abstract class HttpError extends Error {
    public status!: number;
}

export class BadRequestError extends HttpError {
    constructor(message = "Bad Request") {
        super(message);
        this.status = 400;
    }
}

export class UnauthorizedError extends HttpError {
    constructor(message = "Unauthorized") {
        super(message);
        this.status = 401;
    }
}


export class ConflictError extends HttpError {
    constructor(message = "Conflict") {
        super(message);
        this.status = 409;
    }
}