import express from "express"
import dotenv from "dotenv"
import authRoutes from "./src/routes/auth.route.js"
import messageRoutes from "./src/routes/message.route.js"
import { connectDB } from "./src/lib/db.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import path from 'path'



dotenv.config()

const app=express()

const PORT=process.env.PORT
const __dirname=path.resolve()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}
))

app.use("/api/auth",authRoutes)
app.use("/api/message",messageRoutes)

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
    connectDB()
})
