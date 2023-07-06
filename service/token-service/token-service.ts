import jwt from 'jsonwebtoken'
import {Token} from "../../server/entities/Token/Token";
import {getRepository, Repository} from "typeorm";

export const TokenService = {
    generationToken(payload: string) {
        const accessToken = jwt.sign({data: payload}, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'})
        const refreshToken = jwt.sign({data: payload}, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'})

        return {
            accessToken,
            refreshToken
        };
    },

    validateAccessToken(token: string) {
        try {
            const isVerified = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return isVerified;
        } catch (e) {
            return null;
        }
    },

    validateRefreshToken(token: string) {
        try {
            const isVerified = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return isVerified;
        } catch (e) {
            return null;
        }
    },

    async saveToken(userId: string, refreshToken: string) {
        const tokenRepository: Repository<Token> = getRepository(Token);
        const tokenData = await tokenRepository.findOne({ where: { user_id: userId, refreshToken } });
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenRepository.save(tokenData);
        }
        const token = tokenRepository.create({ user_id: userId, refreshToken });
        return tokenRepository.save(token);
    },

    async removeToken(refreshToken: string) {
        const tokenRepository: Repository<Token> = getRepository(Token);
        const tokenData = await tokenRepository.delete({ refreshToken });
        return tokenData;
    },

    async findToken(refreshToken: string) {
        const tokenRepository: Repository<Token> = getRepository(Token);
        const token = await tokenRepository.findOne({ where: { refreshToken } });
        return token;
    }
};