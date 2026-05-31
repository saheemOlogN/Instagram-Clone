import dotenv from "dotenv"
dotenv.config({})
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import connectDb from "./utils/db.js"
import userRoute from "./routes/user.routes.js"

const PORT=process.env.PORT


const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
const corsOptions = {
    origin:'http://localhost:5173',
    credentials:true
} 
app.use(cors(corsOptions))

app.use("/api/v1/user",userRoute)


app.listen(PORT || 3000,()=>{
    connectDb();
    console.log("Server connected ");
})