import express from "express";
import ensureAutenticated from "../middlewares/ensureAutenticated";
import CommentCrontroller from "../controllers/CommentController";

const router = express.Router()

const commentController = new CommentCrontroller()

router
    .get("/comment", commentController.getComments)
    .post("/comment", ensureAutenticated, commentController.create)
    .post("/comment/avaible", ensureAutenticated, commentController.verify)


export default router