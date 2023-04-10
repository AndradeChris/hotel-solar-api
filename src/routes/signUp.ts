import express from "express";
import SignUpController from "../controllers/SignUpController";

const signUpController = new SignUpController()

const router = express.Router()

router
    .post("/signup", signUpController.create)

export default router