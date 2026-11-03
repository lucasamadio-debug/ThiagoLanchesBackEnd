
import { Router } from "express";
import { CategoryController } from "../controllers/CategoryController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const controller = new CategoryController();

router.get("/categorias", controller.findAll);
router.get("/categorias/:id", controller.findById);
router.post("/categorias", authMiddleware, controller.create);
router.put("/categorias/:id", authMiddleware, controller.update);
router.delete("/categorias/:id", authMiddleware, controller.delete);

export default router;
