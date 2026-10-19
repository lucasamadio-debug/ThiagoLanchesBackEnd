import express from "express";
import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";
import productRoutes from "./routes/productRoutes";
import cors from "cors";


const app = express();

app.use(cors({origin: "http://localhost:5173"}));

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/menu", productRoutes);
export default app;