import { Router } from "express";
import { UserAdminController } from "../controllers/UserAdminController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const controller = new UserAdminController();

router.get("/usuarios", authMiddleware, controller.findAll);
router.get("/usuarios/me", authMiddleware, controller.findMe);
router.put("/usuarios/me", authMiddleware, controller.updateMe);
router.get("/usuarios/:id", authMiddleware, controller.findById);
router.put("/usuarios/:id", authMiddleware, controller.update);
router.delete("/usuarios/:id", authMiddleware, controller.delete);

// POST /auth/register permanece com o AuthController já existente.
export default router;
