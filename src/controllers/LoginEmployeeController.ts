import { Request, Response } from "express";
import prismaClient from "../database/prismaClient";
import bcrypt from "bcrypt"
import { createToken } from "../procedures/jwtToken";
import { createRefreshToken } from "../procedures/jwtRefreshoken";
import dayjs from "dayjs"
import { verify } from "jsonwebtoken";

export interface IVerifyTokenPayload {
    id: number,
    role: number
}

class LoginEmployeeController {

    async login(req: Request, res: Response) {

        const messageError = "Email ou senha inválido"

        try {
            const { email, password } = req.body

            const workerExist = await prismaClient.worker.findUnique({
                where: { email }
            })

            if (!workerExist) {
                throw new Error(messageError)
            }

            const workerTokenExist = await prismaClient.workerToken.findFirst({
                where: { worker_id: workerExist.id }
            })

            if (workerTokenExist) {
                await prismaClient.userToken.delete({
                    where: { id: workerTokenExist.id }
                })
            }

            const decryptPass = await bcrypt.compare(password, workerExist!.password)

            if (!decryptPass) {
                throw new Error(messageError)
            }

            const token = createToken({ id: workerExist.id, role: workerExist.role_id })

            const refreshToken = createRefreshToken({ id: workerExist.id, role: workerExist.role_id })

            await prismaClient.workerToken.create({
                data: {
                    refresh_token: refreshToken,
                    worker_id: workerExist.id,
                    expires_in: dayjs().add(3, "h").unix()
                }
            })

            res.status(200).json({
                message: "Funcionário logado com sucesso",
                data: {
                    user: {
                        name: workerExist.name
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

            const { id: worker_id, role } = resultRefreshToken as IVerifyTokenPayload

            const verifyWorkerToken = await prismaClient.workerToken.findFirst({
                where: { worker_id, refresh_token: refreshToken }
            })

            if (!verifyWorkerToken) {
                throw new Error()
            }

            const refreshTokenExpired = dayjs().isAfter(dayjs.unix(verifyWorkerToken.expires_in))

            if (refreshTokenExpired) {
                throw new Error()
            }

            const newToken = createToken({ id: worker_id, role })

            const newRefreshToken = createRefreshToken({ id: worker_id, role })

            await prismaClient.workerToken.delete({
                where: { worker_id }
            })

            await prismaClient.workerToken.create({
                data: {
                    refresh_token: newRefreshToken,
                    worker_id,
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

export default LoginEmployeeController