import { Router } from "express";
import { IngredientController } from "../controllers/IngredientController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const ingredientController = new IngredientController();

router.get("/ingredientes", ingredientController.findAll);
router.get("/ingredientes/:id", ingredientController.findById);
router.post("/ingredientes", authMiddleware, ingredientController.create);
router.put("/ingredientes/:id", authMiddleware, ingredientController.update);
router.delete("/ingredientes/:id", authMiddleware, ingredientController.delete);

export default router;