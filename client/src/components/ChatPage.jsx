import { useEffect, useState } from 'react'
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
            const res= await axios.post(`/api/v1/message/send/${rid}`,{textMessage},{
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
    },[dispatch])

    return (
        <div className='flex min-h-[calc(100dvh-6rem)] w-full flex-col overflow-hidden md:h-screen md:flex-row'>
            <section className='w-full shrink-0 border-b border-border bg-background md:w-80 md:border-b-0 md:border-r'>
                <div className='sticky top-0 z-10 border-b border-border bg-background px-4 py-5'>
                    <h1 className='text-xl font-bold'>{user?.username}</h1>
                </div>

                <div className='max-h-72 overflow-y-auto p-2 md:h-[calc(100vh-73px)] md:max-h-none'>
                    {suggestedUsers.map((suggestedUser) => {
                        const isOnline = onlineUsers.includes(suggestedUser._id)
                        const isSelected = selectedUser?._id === suggestedUser?._id
                        return (
                            <button
                                onClick={()=> dispatch(setSelectedUser(suggestedUser))}
                                key={suggestedUser?._id}
                                className={`flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-gray-100 hover:text-black ${isSelected ? 'bg-muted text-foreground' : 'text-foreground'}`}
                            >
                                <Avatar className='w-14 h-14'>
                                    <AvatarImage src={suggestedUser?.profilePicture} />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>

                                <div className='flex flex-col'>
                                    <span className='font-medium'>{suggestedUser?.username}</span>
                                    <span className={`text-xs font-bold ${isOnline ? 'text-green-500' : 'text-red-500'}`}>{isOnline ? 'online' : 'offline'}</span>

                                </div>
                            </button>
                        )
                    })}

                </div>
            </section>
            {
                selectedUser ? (
                    <section className='flex min-h-[60dvh] min-w-0 flex-1 flex-col bg-background md:h-full'>
                    <div className='sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-card px-4 py-3 text-card-foreground shadow-sm'>
                    <Avatar>
                        <AvatarImage src={selectedUser?.profilePicture} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>

                    <div className='flex flex-col '>
                        <span className='font-semibold'>{selectedUser?.username}</span>
                    </div>
                    </div>
                    <Messages selectedUser={selectedUser} />
                    <div className='flex items-center gap-2 border-t border-border bg-background p-4'>
                        <input
                            value={textMessage}
                            onChange={(e)=>setTextMessage(e.target.value)}
                            type="text"
                            placeholder='Message...'
                            className='min-w-0 flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30'
                        />
                        <Button onClick={()=>{sendMessageHandler(selectedUser?._id)}}>Send</Button>
                    </div>
                    </section>

                ) : (
                    <div className='m-auto flex flex-col items-center justify-center text-muted-foreground'>
                    <MessageCircle className='w-32 h-32 my-4' />
                    <h1 className='text-foreground'>Your messages</h1>
                    <span>Send a message to start the chat...</span>
                    </div>

                )
            }
        </div>
    )
}

export default ChatPage
