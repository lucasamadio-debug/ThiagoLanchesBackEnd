import { Router } from "express";
import { StockController } from "../controllers/StockController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const controller = new StockController();

router.get("/estoque", authMiddleware, controller.findAll);
router.get("/estoque/:id", authMiddleware, controller.findById);
router.post("/estoque", authMiddleware, controller.create);
router.put("/estoque/:id", authMiddleware, controller.update);
router.delete("/estoque/:id", authMiddleware, controller.delete);

export default router;
