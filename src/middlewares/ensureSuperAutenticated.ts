import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'
import { IVerifyTokenPayload } from '../controllers/LoginEmployeeController'

async function ensureSuperAutenticated(req: Request, res: Response, next: NextFunction) {
    try {
        const { authorization } = req.headers

        if (!authorization) {
            throw new Error()
        }

        const [bearer, token] = JSON.parse(authorization).split(' ')

        if (bearer.toLowerCase() !== 'bearer' || !token) {
            throw new Error()
        }

        const resultToken = verify(token, process.env.JWT_SECRET!)

        const { id, role } = resultToken as IVerifyTokenPayload

        if (role !== 1) {
            throw new Error()
        }

        return next()
    } catch (error) {
        res.status(401).json({
            error,
            message: "Não autorizado"
        })
    }
}

export default ensureSuperAutenticated