import express from "express";
import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";
import productRoutes from "./routes/productRoutes";
import ingredientRoutes from "./routes/ingredientRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import stockRoutes from "./routes/stockRoutes";
import userRoutes from "./routes/userRoutes";
import cors from "cors";


const app = express();

app.use(cors({origin: "http://localhost:5173"}));

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/menu", productRoutes);
app.use("/", ingredientRoutes);
app.use("/", categoryRoutes);
app.use("/", stockRoutes);
app.use("/", userRoutes);
export default app;