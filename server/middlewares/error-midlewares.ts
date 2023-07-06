import { Request, Response, NextFunction } from 'express';

export class ApiError extends Error {
    status: number;
    errors?: any[];

    constructor(status: number, message: string, errors?: any[]) {
        super(message);
        this.status = status;
        this.errors = errors;
    }
}

const errorHandler = (
    err: Error | ApiError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof ApiError) {
        console.log('Send error');
        return res
            .status(err.status)
            .json({ message: err.message, errors: err.errors });
    }
    return res
        .status(500)
        .json({ message: 'Произошла непредвиденная ошибка' });
};

export default errorHandler;