import { sign } from "jsonwebtoken"

interface IPayloadJWT {
    id: number,
}

function createToken(payload: IPayloadJWT) {
    const token = sign(payload, process.env.JWT_SECRET!, { expiresIn: "10m" })
    return token
}

export { createToken }