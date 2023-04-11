import express from "express";
import BookingController from "../controllers/BookingController";
import ensureAutenticated from "../middlewares/ensureAutenticated";

const router = express.Router()

const bookingController = new BookingController()

router
    .post("/reserve", ensureAutenticated, bookingController.create)


export default router