import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { setSelectedUser } from '../redux/authSlice'
import { Button } from './ui/button'
import { MessageCircle } from 'lucide-react'
import Messages from './Messages'

const ChatPage = () => {
    const { user, selectedUser,suggestedUsers } = useSelector(store => store.auth)
    const {onlineUsers} = useSelector(store=>store.chat)

    const dispatch = useDispatch()

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
                setSelectedUser?(
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
                        <input type="text" className='flex-1 mr-2 focus-visible:ring-transparent ' />
                        <Button>Send</Button>
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
