import { Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { IVerifyTokenPayload } from "./LoginController";
import prismaClient from "../database/prismaClient";

class UserController {

    async getUser(req: Request, res: Response) {
        try {
            const { authorization } = req.headers

            const [bearer, token] = JSON.parse(authorization!).split(' ')

            const resultToken = await verify(token!, process.env.JWT_SECRET!)

            const { id: user_id, } = resultToken as IVerifyTokenPayload

            const userData = await prismaClient.user.findFirst({
                where: { id: user_id }
            })

            res.status(201).json({
                data: userData,
                message: 'Usuário encontrado'
            })

        } catch (error) {

            res.status(400).json({
                error: (error instanceof Error) ? error.message : error,
                message: 'Erro no get de usuário'
            })

        }
    }

}

export default UserController