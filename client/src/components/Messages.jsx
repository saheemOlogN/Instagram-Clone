import React from 'react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Button } from './ui/button'
import { Link } from 'react-router-dom'

const Messages = ({ selectedUser }) => {
    return (
        <div className='overflow-y-auto flex-1 p-4'>
            <div className='flex  justify-center'>
                <div className='flex justify-center items-center flex-col'>
                    <Avatar className='h-20 w-20'>
                        <AvatarImage  src={selectedUser?.profilePicture} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span>{selectedUser?.username}</span>
                    <Link to={`/profile/${selectedUser?._id}`}><Button className='h-8 my-2 ' variant='secondary'>View Profile</Button></Link>

                </div>


            </div>
            <div className='flex flex-col gap-3 '>
                {
                       [1,2,3,4].map((msg) => {
                    return(
                        <div className={`flex`}>
                            <div>
                                {msg}
                            </div>


                        </div>
                    )
                })

                }
             
            </div>

        </div>
    )
}

export default Messages