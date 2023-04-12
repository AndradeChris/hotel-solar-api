import express from "express";
import ensureSuperAutenticated from "../middlewares/ensureSuperAutenticated";
import SignUpEmployeeController from "../controllers/SignUpEmployeeController";

const workerSignUpController = new SignUpEmployeeController()

const router = express.Router()

router
    .post("/worker-signup", ensureSuperAutenticated, workerSignUpController.create)

export default router