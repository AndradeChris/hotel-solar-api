import { Request, Response } from "express";
import { getUserByToken } from "../utils/handleToken";
import { IVerifyTokenPayload } from "./LoginController";
import prismaClient from "../database/prismaClient";

class CommentCrontroller {

    async create(req: Request, res: Response) {
        try {
            const { authorization } = req.headers
            const { roomId, description, avaliationRating } = req.body

            const { id: user_id } = getUserByToken(authorization!) as IVerifyTokenPayload

            const resultComment = await prismaClient.commentAvaliation.create({
                data: {
                    room_id: roomId,
                    user_id,
                    description,
                    avaliation: avaliationRating,
                }
            })

            res.status(200).json({
                message: "Sucesso fazer avaliação de quarto",
                data: {
                    menssage: resultComment.description,
                    avaliation: resultComment.avaliation,
                    roomId: resultComment.room_id
                }
            })
        } catch (error) {
            res.status(400).json({
                error,
                message: "Erro ao inserir avaliação"
            })
        }
    }

    async verify(req: Request, res: Response) {
        try {
            const { authorization } = req.headers
            const { roomId } = req.body

            const { id: user_id } = getUserByToken(authorization!) as IVerifyTokenPayload

            const existBooking = await prismaClient.booking.findMany({
                where: {
                    user_id,
                    room_id: roomId,
                    checkout_stats: true
                }
            })

            if (!existBooking) {
                res.status(200).json({
                    message: "Usuário indísponivel para comentar",
                    avaliableRoomComment: false
                })
                return
            }

            res.status(200).json({
                message: "Usuário dísponivel para comentar",
                avaliableRoomComment: true
            })
        } catch (error) {
            res.status(400).json({
                error,
                avaliableRoomComment: false
            })
        }
    }

    async getComments(req: Request, res: Response) {
        try {
            const { roomId } = req.params

            const resultComment = await prismaClient.commentAvaliation.findMany({
                where: {
                    room_id: Number(roomId)
                }
            })

            res.status(200).json({
                message: "Sucesso ao buscar avaliações",
                data: resultComment
            })
        } catch (error) {
            res.status(400).json({
                error,
                message: "Erro ao buscar avaliações"
            })
        }
    }

}

export default CommentCrontroller