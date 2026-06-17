import {Server} from "socket.io"
import express from "express"
import http from "http"

const app=express()
const server = http.createServer(app)
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173,http://127.0.0.1:5173')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean)
const io = new Server(server,{
    cors:{
        origin:allowedOrigins,
        methods:['GET','POST'],
        credentials:true
    }
})

const userSocketMap = {}

export const getReceiverSocketId = (rid)=> Array.from(userSocketMap[rid] || [])
io.on('connection',(socket)=>{
    const userId = socket.handshake.query.userId;
    if(userId) {
        if(!userSocketMap[userId]) {
            userSocketMap[userId] = new Set()
        }
        userSocketMap[userId].add(socket.id)
        console.log(`user connected : UserId = ${userId}, SocketId = ${socket.id}`)
    }

    
        io.emit('getOnlineUsers',Object.keys(userSocketMap))

    socket.on('disconnect',()=>{
        if(userId) {
            userSocketMap[userId]?.delete(socket.id)
            if(userSocketMap[userId]?.size === 0) {
                delete userSocketMap[userId]
            }
             console.log(`user disconnected : UserId = ${userId}, SocketId = ${socket.id}`)
        }

        
        io.emit('getOnlineUsers',Object.keys(userSocketMap))

    })
})

export {app,server,io}
