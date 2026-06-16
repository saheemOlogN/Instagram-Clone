import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { setSelectedUser } from '../redux/authSlice'
import { Button } from './ui/button'
import { MessageCircle } from 'lucide-react'
import Messages from './Messages'
import axios from 'axios'
import { setMessages } from '../redux/chatSlice'

const ChatPage = () => {
    const { user, selectedUser,suggestedUsers } = useSelector(store => store.auth)
    const {onlineUsers,messages} = useSelector(store=>store.chat)
    const [textMessage,setTextMessage] = useState("")
    

    const dispatch = useDispatch()

    const sendMessageHandler = async(rid)=>{
        if (!rid || !textMessage.trim()) return

        try {
            const res= await axios.post(`http://localhost:8000/api/v1/message/send/${rid}`,{textMessage},{
                headers:{
                    'Content-Type':'application/json'
                },
                withCredentials:true
            })

            if(res.data.success){
                dispatch(setMessages([...messages,res.data.newMessage]))
                setTextMessage("")
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        return ()=>(
            dispatch(setSelectedUser(null))
        )
    },[])

    return (
        <div className='flex ml-[16%] h-screen'>
            <section className='w-full md:w-1/4 my-8 '>
                <h1 className='font-bold mb-4 px-3 text-xl'>{user?.username}</h1>
                <hr className='mb-4 border-gray-300' />

                <div className='overflow-y-auto h-[80vh]'>
                    {suggestedUsers.map((suggestedUser) => {
                        const isOnline = onlineUsers.includes(suggestedUser._id)
                        return (
                            <div onClick={()=> dispatch(setSelectedUser(suggestedUser))} key={suggestedUser?._id} className='flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer'>
                                <Avatar className='w-14 h-14'>
                                    <AvatarImage src={suggestedUser?.profilePicture} />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>

                                <div className='flex flex-col'>
                                    <span>{suggestedUser?.username}</span>
                                    <span className={`text-xs font-bold ${isOnline ? 'text-green-500' : 'text-red-500'}`}>{isOnline ? 'online' : 'offline'}</span>

                                </div>
                            </div>
                        )
                    })}

                </div>
            </section>
            {
                selectedUser ? (
                    <section className='flex-1 border-1 border-1-gray-300 flex flex-col h-full'>
                    <div className='flex gap-3 items-center px-3 py-2 border-b border-gray-300  sticky top-0 bg-white z-10'>
                    <Avatar>
                        <AvatarImage src={selectedUser?.profilePicture} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>

                    <div className='flex flex-col '>
                        <span>{selectedUser?.username}</span>
                    </div>
                    </div>
                    <Messages selectedUser={selectedUser} />
                    <div className='flex items-center p-4  border-t-gray-300'>
                        <input value={textMessage} onChange={(e)=>setTextMessage(e.target.value)} type="text" className='flex-1 mr-2 focus-visible:ring-transparent ' />
                        <Button onClick={()=>{sendMessageHandler(selectedUser?._id)}}>Send</Button>
                    </div>
                    </section>

                ) : (
                    <div className='flex flex-col justify-center items-center m-auto'>
                    <MessageCircle className='w-32 h-32 my-4' />
                    <h1>Your messages</h1>
                    <span>Send a message to start the chat...</span>
                    </div>

                )
            }
        </div>
    )
}

export default ChatPage
