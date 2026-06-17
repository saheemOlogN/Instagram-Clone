import dotenv from "dotenv"
dotenv.config({})
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import connectDb from "./utils/db.js"
import userRoute from "./routes/user.routes.js"
import postRoute from "./routes/post.routes.js"
import messageRoute from "./routes/message.routes.js"
import { app,server } from "./socket/socket.js"
import path from "path"

const PORT=process.env.PORT

const __dirname=path.resolve()


app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173,http://127.0.0.1:5173')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean)

const corsOptions = {
    origin: allowedOrigins,
    credentials:true
}
app.use(cors(corsOptions))

app.use("/api/v1/user",userRoute)
app.use("/api/v1/post",postRoute)
app.use("/api/v1/message",messageRoute)

app.use(express.static(path.join(__dirname, "/client/dist")))
app.get(/.*/,(req,res)=>{
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"))
})


server.listen(PORT || 3000,()=>{
    connectDb();
    console.log("Server connected ");
})
