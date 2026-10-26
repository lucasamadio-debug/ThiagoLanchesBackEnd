import { Router } from "express";
import { ProductController } from "../controllers/ProductController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const productController = new ProductController();

router.get("/", productController.findAll);
router.get("/:id", productController.findById);

router.post("/", authMiddleware, productController.create);
router.put("/:id", authMiddleware, productController.update);
router.delete("/:id", authMiddleware, productController.delete);

export default router;