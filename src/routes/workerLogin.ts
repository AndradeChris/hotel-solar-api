import express from "express";
import LoginEmployeeController from "../controllers/LoginEmployeeController";

const workerLoginController = new LoginEmployeeController()

const router = express.Router()

router
    .post("/worker-login", workerLoginController.login)
    .post("/worker-refresh-token", workerLoginController.refreshToken)

export default router