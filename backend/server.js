import express from "express"
import dotenv from "dotenv"
import connectDB  from "./config/db.js"
import authRouter from "./routes/authRoutes.js"
import analyticsRoutes from "./routes/analyticsRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config()

const app = express()

app.use(express.json())

connectDB()

app.use(
  cors({
    origin: "http://localhost:5173", // frontend port
    credentials: true
  })
);
app.use(cookieParser());

app.use("/api/auth", authRouter)
app.use("/api/analytics", analyticsRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.send("Analytics SaaS API Running")  
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})