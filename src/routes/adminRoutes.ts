import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/dashboard", authMiddleware, (req, res) => {
    res.status(200).json({
        message: "Bem-vindo à dashboard administrativa!"
    });
});

export default router;