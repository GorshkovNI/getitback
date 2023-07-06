import {NextFunction, Request, Response} from 'express';
import {UserService} from "../../service/user-service/user-service";
import {ApiError} from "../middlewares/error-midlewares";

export const UserController = {
    async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            await UserService.registration(req.body);
            res.send('Зарегистрирован');
        } catch (error) {
            next(error);
        }
    }
};

