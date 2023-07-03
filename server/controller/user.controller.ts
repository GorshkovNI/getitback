import { Request, Response } from 'express';
import {getRepository} from "typeorm";
import {User} from "../entities/User";
import bcrypt from 'bcrypt';

export const UserController = {
    async  createUser(req: Request, res: Response){
        try{
            const userRepository = getRepository(User);

            const { name, email, phone_number, password, activation_link  } = req.body;

            const user = new User();
            user.name = name;
            user.email = email;
            user.phone = phone_number;
            user.password = await bcrypt.hash(password, 10);
            user.activation_link = 'active'
            user.is_activated = false

            await userRepository.save(user);

            res.send('User has been saved');
        }catch (e){

        }
    }
}

