import { Request, Response } from "express";
import prismaClient from "../database/prismaClient";
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError, PrismaClientValidationError } from "@prisma/client/runtime";

class SignUpController {

    async create(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body

            const alredyUser = await prismaClient.user.findUnique({
                where: { email }
            })

            if (alredyUser !== null) {
                throw new Error("Email já cadastrado")
            }

            const user = await prismaClient.user.create({
                data: {
                    name,
                    email,
                    password
                }
            })

            res.status(201).json({
                data: user,
                message: 'Usuário criado'
            })

        } catch (error) {

            res.status(400).json({
                error: (error instanceof Error) ? error.message : error,
                message: 'Erro ao criar usuário'
            })

        }
    }

}

export default SignUpController