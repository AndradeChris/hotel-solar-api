import express from "express";
import ensureAutenticated from "../middlewares/ensureAutenticated";
import UserController from "../controllers/UserController";


const router = express.Router()

const userController = new UserController()

router
    .get("/user", ensureAutenticated, userController.getUser)

export default router