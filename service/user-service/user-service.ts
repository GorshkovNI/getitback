import {IUserServiceLogin, IUserServiceRegistration} from "./index";
import {FindOneOptions, getRepository} from "typeorm";
import bcrypt from 'bcrypt';
import {User} from "../../server/entities/User";
import { v4 as uuidv4 } from 'uuid';
import {MailService} from "../mail-service/mail-service";
import {TokenService} from "../token-service/token-service";
import errorMidlewares, {ApiError} from "../../server/middlewares/error-midlewares";
import {JwtPayload} from "jsonwebtoken";
import {AppDataSource} from "../../server/db/db";


export const UserService = {

    async registration(userInfo: IUserServiceRegistration){

        try{
            const userRepository = AppDataSource.getRepository(User);

            const { name, email, phone_number, password  } = userInfo;

            const isUser = await userRepository.findOne({where: {email: email}})

            if(isUser){
                throw new ApiError(409, 'exists', ['Такой юзер уже есть']);
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

    },

    async login(userInfo: IUserServiceLogin){
      try{
          const userRepository = AppDataSource.getRepository(User);
          const {email, password} = userInfo
          const user = await userRepository.findOne({where: {email: email}})
          if(!user){
              console.log("Пользователя нет")
              throw ApiError.BadRequest(`notExists`)
          }

          const isPassEqual = bcrypt.compare(password, user.password)
          if(!isPassEqual){
              throw ApiError.BadRequest('notExists')
          }

          const tokens = TokenService.generationToken(email)
          await TokenService.saveToken(user.id, tokens.refreshToken)

          return {...tokens, user:user}

      }catch (e) {
          throw e
      }
    },

    async refresh(refreshToken){
        try{
            const userRepository = AppDataSource.getRepository(User);
            if(!refreshToken){
                throw ApiError.UnautorizedErrors()
            }
            console.log('token')
            const userData = TokenService.validateRefreshToken(refreshToken) as JwtPayload
            const token = TokenService.findToken(refreshToken)

            if(!token ||  !userData){ // !!token - потому что findToken вернет 0 или 1 (0 - нет токена в БД, 1 - токен существует)
                throw ApiError.UnautorizedErrors()
            }

            console.log("userData: ", userData.data)
            console.log("token: ", token)
            const user = await userRepository.findOne({where: {email: userData.data}});
            const tokens = TokenService.generationToken({userData})
            await TokenService.saveToken(user.id, tokens.refreshToken)
            return {...tokens, user: user}
        }catch (e){
            throw e
        }

    },
    
    async logout(refreshToken){
        try{
            const token = await TokenService.removeToken(refreshToken)
            return token
        }catch (e) {
            throw e
        }
    }
}