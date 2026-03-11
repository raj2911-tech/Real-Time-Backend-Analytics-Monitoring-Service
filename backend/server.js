import express from "express"
import dotenv from "dotenv"
import connectDB  from "./config/db.js"

dotenv.config()

const app = express()

app.use(express.json())

connectDB()

app.get("/", (req, res) => {
  res.send("Analytics SaaS API Running")
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})