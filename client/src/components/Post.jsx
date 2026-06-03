import React from 'react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";
import { IoIosSend } from "react-icons/io";
import { FaRegBookmark } from "react-icons/fa6";

const Post = () => {
    return (
        <div className='my-8 w-full max-w-sm mx-auto'>
            <div className='flex items-center justify-between'>

                <div className='flex items-center gap-2'>
                    <Avatar>
                        <AvatarImage src='' alt='' />
                        <AvatarFallback>CN</AvatarFallback>

                    </Avatar>
                    <h1>Username</h1>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className='cursor-pointer' />

                    </DialogTrigger>
                    <DialogContent className='flex flex-col items-center text-sm text-center '>
                        <Button variant='ghost' className='cursor-pointer w-fit text-[#ED4956]'>Unfollow</Button>
                        <Button variant='ghost' className='cursor-pointer w-fit'>Add to Favourites</Button>
                        <Button variant='ghost' className='cursor-pointer w-fit font-bold'>Delete</Button>
                    </DialogContent>

                </Dialog>

            </div>
            <img
                className='rounded-sm my-2 w-full aspect-square object-cover'
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcAOZ0UcyYsrRhxUkZk6nG66WTLg-NhiTEcg&s" alt=""
            />



            <div className='flex items-center justify-between my-2'>
                <div className='flex items-center gap-3'>
                    <FaRegHeart className='cursor-pointer hover:text-gray-600' />
                    <FiMessageCircle className='cursor-pointer hover:text-gray-600' />
                    <IoIosSend className='cursor-pointer hover:text-gray-600' />
                </div>

                <FaRegBookmark className='cursor-pointer hover:text-gray-600' />
            </div>

        </div>


    )
}

export default Post