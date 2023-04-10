import { Request, Response } from "express";
import prismaClient from "../database/prismaClient";
import bcrypt from "bcrypt"

class SignUpController {

    async create(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body

            const userExist = await prismaClient.user.findUnique({
                where: { email }
            })

            if (userExist) {
                throw new Error("Email já cadastrado")
            }

            const hashPassword = await bcrypt.hash(password, 10)

            const user = await prismaClient.user.create({
                data: {
                    name,
                    email,
                    password: hashPassword
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