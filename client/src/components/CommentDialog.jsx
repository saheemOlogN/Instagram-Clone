import React from 'react'
import { Dialog, DialogContent, DialogTitle } from './ui/dialog'

import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Link } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import { DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { useState } from 'react'

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("")
  const changeEventHandler =(e)=>{
    const inputText=e.target.value;
    if(inputText.trim()){
      setText(inputText)
    }
    else{
      setText("")
    }
  }

  const sendMessageHandler = async ()=>{
    alert(text)
  }
  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogContent onInteractOutside={() => setOpen(false)} className='max-w-5xl p-0 flex flex-col'>
        <DialogTitle className='sr-only'>Comments</DialogTitle>
        <div className='flex flex-1 '>
          <div className='w-1/2'>
            <img className='w-full h-full object-cover rounded-l-lg' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcAOZ0UcyYsrRhxUkZk6nG66WTLg-NhiTEcg&s" alt="" />
          </div>
          <div className='w-1/2 flex flex-col'>
            <div className='flex items-center justify-between p-4'>
              <div className='flex gap-3 items-center'>

                <Link>
                  <Avatar>
                    <AvatarImage />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>

                </Link>

                <div>
                  <Link className='font-semibold text-xs '>Username</Link>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className='cursor-pointer ' />
                </DialogTrigger>

                <DialogContent className='flex flex-col items-center text-center'>
                  <DialogTitle className='sr-only'>Post options</DialogTitle>
                  <div className='cursor-pointer  w-full text-[#ED4956] font-bold'>
                   Unfollow
                  </div>
                  <div>
                   Bookmark
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <hr />
            <div className='flex-1 overflow-y-auto max-h-96 p-4'>
              comments aaye ge
            </div>

            <div className='p-4'>
              <div className='flex items-center gap-2'> 
                <input type="text" placeholder="Add a comment..." className='w-full outline-none border-gray-300 p-2 rounded' />
                <Button disabled={!text.trim()} variant='outline'>Post</Button>
              </div>

            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CommentDialog
