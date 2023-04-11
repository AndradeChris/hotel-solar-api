import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'

async function ensureAutenticated(req: Request, res: Response, next: NextFunction) {
    try {
        const { authorization } = req.headers

        if (!authorization) {
            throw new Error()
        }

        const [bearer, token] = JSON.parse(authorization).split(' ')

        if (bearer.toLowerCase() !== 'bearer' || !token) {
            throw new Error()
        }

        verify(token, process.env.JWT_SECRET!)

        return next()
    } catch (error) {
        res.status(401).json({
            error,
            message: "Não autorizado"
        })
    }
}

export default ensureAutenticated