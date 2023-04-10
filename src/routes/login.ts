import express from "express";
import LoginController from "../controllers/LoginController";

const loginController = new LoginController()

const router = express.Router()

router
    .post("/login", loginController.login)
    .post("refresh-token", loginController.refreshToken)

export default router