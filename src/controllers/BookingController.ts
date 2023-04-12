import { Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { IVerifyTokenPayload } from "./LoginController";
import prismaClient from "../database/prismaClient";
import dayjs from "dayjs";

class BookingController {

    async create(req: Request, res: Response) {
        try {
            const { authorization } = req.headers

            const { roomId, checkIn, checkOut, amountPeople, additionalServices } = req.body

            const [, token] = JSON.parse(authorization!).split(' ')
            const resultToken = await verify(token!, process.env.JWT_SECRET!)

            const { id: user_id, } = resultToken as IVerifyTokenPayload

            const availableRooms = await prismaClient.room.findFirst({
                where: {
                    id: roomId
                }
            })

            if (availableRooms!.avaible_units <= 0) {
                throw new Error(`Quantidade máxima de quarto do tipo ${availableRooms?.type} ocupado`)
            }

            const createBooking = await prismaClient.booking.create({
                data: {
                    user_id,
                    room_id: roomId,
                    check_in: dayjs(checkIn).toDate(),
                    check_out: dayjs(checkOut).toDate(),
                    amount_people: amountPeople,
                }
            })

            if (additionalServices) {
                await prismaClient.additionalService.create({
                    data: {
                        services: JSON.stringify(additionalServices),
                        booking_id: createBooking.id
                    }
                })
            }

            await prismaClient.room.update({
                data: {
                    avaible_units: availableRooms!.avaible_units - 1
                },
                where: {
                    id: availableRooms!.id
                }
            })

            res.status(201).send({
                data: {
                    reserveId: createBooking.reserve_id
                },
                message: "Reserva feita com sucesso"
            })
        } catch (error) {
            res.status(400).send({
                error: error,
                message: "Erro ao fazer reserva"
            })
        }
    }

}

export default BookingController