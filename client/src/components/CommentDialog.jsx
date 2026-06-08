import { Dialog, DialogContent, DialogTitle } from './ui/dialog'

import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Link } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import { DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'

const CommentDialog = ({ open, setOpen, post, comments = [], text, changeEventHandler, commentHandler }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogContent onInteractOutside={() => setOpen(false)} className='w-[96vw] max-w-[96vw] sm:max-w-[980px] h-[88vh] max-h-[720px] p-0 overflow-hidden'>
        <DialogTitle className='sr-only'>Comments</DialogTitle>
        <div className='flex h-full min-h-0 flex-col md:flex-row'>
          <div className='h-[45vh] md:h-full md:w-[58%] bg-black flex items-center justify-center'>
            <img className='max-h-full max-w-full object-contain' src={post?.image} alt="" />
          </div>
          <div className='flex min-h-0 flex-1 flex-col bg-white md:w-[42%]'>
            <div className='flex shrink-0 items-center justify-between border-b p-4'>
              <div className='flex gap-3 items-center'>

                <Link>
                  <Avatar>
                    <AvatarImage src={post?.author?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>

                </Link>

                <div>
                  <Link className='font-semibold text-xs '>{post?.author?.username}</Link>
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
            <div className='min-h-0 flex-1 overflow-y-auto p-4'>
              {comments.length > 0 ? comments.map((comment) => (
                <div key={comment._id} className='mb-4 flex gap-3'>
                  <Avatar>
                    <AvatarImage src={comment.author?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <p className='text-sm'>
                    <span className='font-semibold mr-2'>{comment.author?.username}</span>
                    {comment.text}
                  </p>
                </div>
              )) : (
                <p className='text-sm text-gray-500'>No comments yet.</p>
              )}
            </div>

            <div className='shrink-0 border-t p-4'>
              <div className='flex items-center gap-2'> 
                <input value={text} onChange={changeEventHandler} type="text" placeholder="Add a comment..." className='w-full min-w-0 outline-none p-2 text-sm' />
                <Button onClick={commentHandler} disabled={!text.trim()} variant='outline'>Post</Button>
              </div>

            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CommentDialog
