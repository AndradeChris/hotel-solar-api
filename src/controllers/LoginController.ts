import { Request, Response } from "express";
import prismaClient from "../database/prismaClient";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

class LoginController {

    async login(req: Request, res: Response) {

        const messageError = "Erro ao logar usuário"

        try {
            const { email, password } = req.body

            const userExist = await prismaClient.user.findUnique({
                where: { email }
            })

            const userRefreshTokenExist = await prismaClient.userToken.findFirst({
                where: { user_id: userExist?.id }
            })

            if (userRefreshTokenExist) {
                await prismaClient.userToken.delete({
                    where: { id: userRefreshTokenExist.id }
                })
            }

            if (!userExist) {
                throw new Error(messageError)
            }

            const decryptPass = await bcrypt.compare(password, userExist!.password)

            if (userExist?.email !== email && !decryptPass) {
                throw new Error(messageError)
            }

            const payloadJWT = {
                id: userExist.id,
                name: userExist.name
            }

            const token = jwt.sign(payloadJWT, process.env.JWT_SECRET!, { expiresIn: "10m" })

            const refreshToken = jwt.sign(payloadJWT, process.env.JWT_REFRESH_SECRET!, { expiresIn: "15m" })

            const expiresRefreshToken = new Date(new Date().getTime() + (5 * 24 * 60 * 60 * 1000))

            await prismaClient.userToken.create({
                data: {
                    refresh_token: refreshToken,
                    user_id: userExist.id,
                    expires_in: expiresRefreshToken,
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
    }

}

export default LoginController