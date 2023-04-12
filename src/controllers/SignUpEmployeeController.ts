import { Request, Response } from "express";
import prismaClient from "../database/prismaClient";
import bcrypt from "bcrypt"

class SignUpController {

    async create(req: Request, res: Response) {
        try {
            const { name, email, password, role } = req.body

            const workerExist = await prismaClient.worker.findUnique({
                where: { email }
            })

            if (workerExist) {
                throw new Error("Email já cadastrado")
            }

            const hashPassword = await bcrypt.hash(password, 10)

            const worker = await prismaClient.worker.create({
                data: {
                    name,
                    email,
                    password: hashPassword,
                    role_id: role
                }
            })

            const { password: _, ...data } = worker

            res.status(201).json({
                data: data,
                message: 'Funcionário criado'
            })

        } catch (error) {

            res.status(400).json({
                error: (error instanceof Error) ? error.message : error,
                message: 'Erro ao criar funcionário'
            })

        }
    }

}

export default SignUpController