import { Request, Response } from 'express';
import {UserService} from "../../service/user-service/user-service";

export const UserController = {
    async  createUser(req: Request, res: Response){
        try{
            const user = await UserService.registration(req.body)
            res.send('User has been saved');
        }catch (e){
            console.log(e)
        }
    }
}

