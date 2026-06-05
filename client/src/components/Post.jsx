import React, { useState } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";
import { IoIosSend } from "react-icons/io";
import { FaRegBookmark } from "react-icons/fa6";
import CommentDialog from './CommentDialog'

const Post = () => {
    const [text, setText] = useState("")
    const [open, setOpen] = useState(false)

    const changeEventHandler = (e) => {
        const inputText = e.target.value;

        if (inputText.trim()) {
            setText(inputText)
        }
        else {
            setText("")
        }

    }

    return (
        <div className='my-8 w-full max-w-sm mx-auto'>
            <div className='flex items-center justify-between'>

                <div className='flex items-center gap-2'>
                    <Avatar>
                        <AvatarImage src='' alt='' />
                        <AvatarFallback>CN</AvatarFallback>

                    </Avatar>
                    <h1>Skibdi Dop Dop</h1>
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
                    <FiMessageCircle onClick={()=>setOpen(true)} className='cursor-pointer hover:text-gray-600' />
                    <IoIosSend className='cursor-pointer hover:text-gray-600' />
                </div>

                <FaRegBookmark className='cursor-pointer hover:text-gray-600' />
            </div>
            <span className='font-medium block mb-1'>67 Likes</span>

            <p>
                <span className='font-medium mr-3'>Username</span>
                Im bouta kick Kaido's butt
            </p>
            <span onClick={()=>setOpen(true)}>View All 10 comments</span>
            <CommentDialog open={open} setOpen={setOpen}/>
                <div className='flex justify-between'>
                    <input type="text"
                        placeholder="Add a comment"
                        value={text}
                        onChange={changeEventHandler}
                        className='outline-none text-sm w-full font-medium'
                    />

                    {
                        text && <span className='text-[#3BADF8]'>Post</span>
                    }
                </div>


            

        </div>


    )
}

export default Post