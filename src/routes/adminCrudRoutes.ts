
import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { AdminPaginationController } from "../controllers/AdminPaginationController";
import { ProductController } from "../controllers/ProductController";
import { IngredientController } from "../controllers/IngredientController";
import { CategoryController } from "../controllers/CategoryController";
import { StockController } from "../controllers/StockController";

const router = Router();

const pagination = new AdminPaginationController();
const produtos = new ProductController();
const ingredientes = new IngredientController();
const categorias = new CategoryController();
const estoque = new StockController();

router.use(authMiddleware);

router.get("/produtos", pagination.listar("produtos"));
router.get("/produtos/:id", produtos.findById);
router.post("/produtos", produtos.create);
router.put("/produtos/:id", produtos.update);
router.delete("/produtos/:id", produtos.delete);

router.get("/ingredientes", pagination.listar("ingredientes"));
router.get("/ingredientes/:id", ingredientes.findById);
router.post("/ingredientes", ingredientes.create);
router.put("/ingredientes/:id", ingredientes.update);
router.delete("/ingredientes/:id", ingredientes.delete);

router.get("/categorias", pagination.listar("categorias"));
router.get("/categorias/:id", categorias.findById);
router.post("/categorias", categorias.create);
router.put("/categorias/:id", categorias.update);
router.delete("/categorias/:id", categorias.delete);

router.get("/estoque", pagination.listar("estoque"));
router.get("/estoque/:id", estoque.findById);
router.post("/estoque", estoque.create);
router.put("/estoque/:id", estoque.update);
router.delete("/estoque/:id", estoque.delete);

export default router;
