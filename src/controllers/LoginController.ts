import { Request, Response } from "express";
import prismaClient from "../database/prismaClient";
import bcrypt from "bcrypt"
import { createToken } from "../procedures/jwtToken";
import { createRefreshToken } from "../procedures/jwtRefreshoken";
import dayjs from "dayjs"
import { verify } from "jsonwebtoken";

export interface IVerifyTokenPayload {
    id: number,
}

class LoginController {

    async login(req: Request, res: Response) {

        const messageError = "Email ou senha inválido"

        try {
            const { email, password } = req.body

            const userExist = await prismaClient.user.findUnique({
                where: { email }
            })

            if (!userExist) {
                throw new Error(messageError)
            }

            const userTokenExist = await prismaClient.userToken.findFirst({
                where: { user_id: userExist.id }
            })

            if (userTokenExist) {
                await prismaClient.userToken.delete({
                    where: { id: userTokenExist.id }
                })
            }

            const decryptPass = await bcrypt.compare(password, userExist!.password)

            if (!decryptPass) {
                throw new Error(messageError)
            }

            const token = createToken({ id: userExist.id })

            const refreshToken = createRefreshToken({ id: userExist.id })

            await prismaClient.userToken.create({
                data: {
                    refresh_token: refreshToken,
                    user_id: userExist.id,
                    expires_in: dayjs().add(3, "h").unix()
                }
            })

            res.status(200).json({
                message: "Usuário logado com sucesso",
                data: {
                    user: {
                        name: userExist.name
                    },
                    token,
                    refreshToken
                }
            })


        } catch (error) {

            res.status(400).json({
                error: (error instanceof Error) ? error.message : error,
                message: messageError
            })

        }
    }

    async refreshToken(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body

            if (!refreshToken) {
                throw new Error()
            }

            const resultRefreshToken = verify(refreshToken, process.env.JWT_REFRESH_SECRET!)

            if (!resultRefreshToken) {
                throw new Error()
            }

            const { id: user_id, } = resultRefreshToken as IVerifyTokenPayload

            const verifyUserToken = await prismaClient.userToken.findFirst({
                where: { user_id, refresh_token: refreshToken }
            })

            if (!verifyUserToken) {
                throw new Error()
            }

            const refreshTokenExpired = dayjs().isAfter(dayjs.unix(verifyUserToken.expires_in))

            if (refreshTokenExpired) {
                throw new Error()
            }

            const newToken = createToken({ id: user_id })

            const newRefreshToken = createRefreshToken({ id: user_id })

            await prismaClient.userToken.delete({
                where: { user_id }
            })

            await prismaClient.userToken.create({
                data: {
                    refresh_token: newRefreshToken,
                    user_id,
                    expires_in: dayjs().add(3, "h").unix()
                }
            })

            res.status(200).json({
                message: "Sucesso ao solicar refresh token",
                data: {
                    token: newToken,
                    refreshToken: newRefreshToken
                }
            })


        } catch (error) {

            res.status(400).json({
                error,
                message: "Não autorizado"
            })

        }
    }

}

export default LoginController