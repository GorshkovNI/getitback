import {TokenService} from "../../service/token-service/token-service";
import {ApiError} from "./error-midlewares";


module.exports = function (req, res, next){
    try{
        const authorizationHeader = req.headers.authorization

        if(!authorizationHeader){
            return next(ApiError.UnautorizedErrors());
        }
        const accessToken = authorizationHeader.split(" ")[1]

        if(!accessToken){
            return next(ApiError.UnautorizedErrors());
        }

        const userData = TokenService.validateAccessToken(accessToken);
        if(!userData){
            return next(ApiError.UnautorizedErrors());
        }
        req.user = userData
        next();

    }
    catch (e){
        return next(ApiError.UnautorizedErrors());
    }
}