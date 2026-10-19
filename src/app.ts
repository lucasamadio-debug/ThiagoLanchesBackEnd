import express from "express";
import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";
import cors from "cors";


const app = express();

app.use(cors({origin: "http://localhost:5173"}));

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);

export default app;