import {IUserServiceRegistration} from "./index";
import {FindOneOptions, getRepository} from "typeorm";
import bcrypt from 'bcrypt';
import {User} from "../../server/entities/User";
import { v4 as uuidv4 } from 'uuid';
import {MailService} from "../mail-service/mail-service";
import {TokenService} from "../token-service/token-service";
import errorMidlewares, {ApiError} from "../../server/middlewares/error-midlewares";


export const UserService = {

    async generateUniqueUserId() {
        let userId = '';
        let isUnique = false;
        const userRepository = getRepository(User);

        while (!isUnique) {
            userId = uuidv4();
            const existingUser = await userRepository.findOne({ where: { id: userId } });

            if (!existingUser) {
                isUnique = true;
            }
        }

        return userId;
    },

    async registration(userInfo: IUserServiceRegistration){

        try{
            const userRepository = getRepository(User);

            const { name, email, phone_number, password  } = userInfo;

            const isUser = await userRepository.findOne({where: {email: email}})

            if(isUser){
                throw new ApiError(409, 'Такой юзер уже есть', ['Такой юзер уже есть']);
            }

            const user = new User();
            const mailService = new MailService()


            user.name = name;
            user.email = email;
            user.phone = phone_number;
            user.password = await bcrypt.hash(password, 10);
            user.is_activated = false


            //Activation link
            console.log(name, email, phone_number, password)
            const activationLink = uuidv4();
            console.log(activationLink)
            await mailService.sendActivationMail(email, `${process.env.API_URL}/activate/${activationLink}`)

            user.activation_link = activationLink

            await userRepository.save(user)

            const user_id = user.id

            const tokens = TokenService.generationToken(email)
            await TokenService.saveToken(user_id, tokens.refreshToken)

            return user
        }catch (e) {
            console.log(e)
            throw e
        }


        // await userRepository.save(user);

    }
}