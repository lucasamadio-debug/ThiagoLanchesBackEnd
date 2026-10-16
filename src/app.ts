import express from "express";
import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";

const app = express();

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);

export default app;