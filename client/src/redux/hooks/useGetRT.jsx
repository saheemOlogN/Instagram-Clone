import axios from "axios"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setMessages } from "../chatSlice"

const useGetAllRT = () =>{
    const dispatch = useDispatch()
    const {socket} = useSelector(store=>store.socketio)
    const {messages} = useSelector(store=>store.chat)
    const {user, selectedUser} = useSelector(store=>store.auth)
    useEffect(()=>{
        if (!socket) return

        const messageHandler = (newMessage)=>{
            const isCurrentChat =
                newMessage.senderId === selectedUser?._id ||
                (newMessage.senderId === user?._id && newMessage.receiverId === selectedUser?._id)

            if(!isCurrentChat) return

            dispatch(setMessages([...messages,newMessage]))
        }

        socket.on('newMessage',messageHandler)

        return()=>{
            socket.off('newMessage',messageHandler)
        }

    },[socket,messages,user?._id,selectedUser?._id,dispatch])

}
export default useGetAllRT
