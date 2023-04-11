import { sign, verify } from "jsonwebtoken"

type PayloadRefreshJWT = {
    id: number,
}

function createRefreshToken(payload: PayloadRefreshJWT) {
    const refreshToken = sign(payload, process.env.JWT_REFRESH_SECRET!)
    return refreshToken
}

export { createRefreshToken }