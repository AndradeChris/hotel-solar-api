import { verify } from "jsonwebtoken"

export function getUserByToken(authorization: string) {
    const [bearer, token] = JSON.parse(authorization).split(' ')

    return verify(token, process.env.JWT_SECRET!)
}