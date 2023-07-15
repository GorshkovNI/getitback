import {NextFunction, Request, Response} from 'express';
import {UserService} from "../../service/user-service/user-service";
import {ApiError} from "../middlewares/error-midlewares";
import {User} from "../entities/User";

export const UserController = {
    async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            await UserService.registration(req.body);
            res.send('Зарегистрирован');
        } catch (error) {
            next(error);
        }
    },

    async login(req: Request, res: Response, next: NextFunction){
        try{
            const user = await UserService.login(req.body)
            console.log('Пользователь вошел')

            res.cookie('refreshToken', user.refreshToken, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                //secure: true, // cookie will only be sent over HTTPS
                //sameSite: 'strict'
            })

            return res.json(user)
        }catch (error){
            next(error);
        }
    },

    async refresh(req: Request, res: Response, next: NextFunction){
        try{
            console.log('Обновляю токен')
            const {refreshToken} = req.cookies
            console.log('cookie:', req.cookies)
            const newRefreshToken = await UserService.refresh(refreshToken)
            res.cookie('refreshToken', refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                //sameSite: 'strict'
                //domain: 'getit-khaki.vercel.app',
                //secure: true,
                //path: '/'
            })
            return res.json(newRefreshToken)
        }
        catch (e){
            console.log('Ошибка в refresh')
            next(e)
        }
    },

    async logout(req: Request, res: Response, next: NextFunction){
        try{
            const {refreshToken} = req.cookies
            const token = await UserService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json(token)

        }catch (e){
            console.log('Ошибка в logout')
            next(e)
        }
    }

};

