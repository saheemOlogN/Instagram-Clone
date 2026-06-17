import { Dialog, DialogContent, DialogTitle } from './ui/dialog'

import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Link } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import { DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'

const CommentDialog = ({
  open,
  setOpen,
  post,
  comments = [],
  text,
  changeEventHandler,
  commentHandler,
  bookmarkHandler,
  followOrUnfollowAuthorHandler,
  deletePostHandler,
  isOwnPost,
  isPostBookmarked,
  isFollowingAuthor
}) => {
  const authorId = typeof post?.author === 'string' ? post.author : post?.author?._id

  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogContent onInteractOutside={() => setOpen(false)} className='h-[88dvh] max-h-[720px] w-[96vw] max-w-[96vw] overflow-hidden p-0 sm:max-w-[980px]'>
        <DialogTitle className='sr-only'>Comments</DialogTitle>
        <div className='flex h-full min-h-0 flex-col md:flex-row'>
          <div className='h-[45vh] md:h-full md:w-[58%] bg-black flex items-center justify-center'>
            <img className='max-h-full max-w-full object-contain' src={post?.image} alt="" />
          </div>
          <div className='flex min-h-0 flex-1 flex-col bg-card text-card-foreground md:w-[42%]'>
            <div className='flex shrink-0 items-center justify-between border-b border-border p-4'>
              <div className='flex gap-3 items-center'>

                <Link to={authorId ? `/profile/${authorId}` : '#'}>
                  <Avatar>
                    <AvatarImage src={post?.author?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>

                </Link>

                <div>
                  <Link to={authorId ? `/profile/${authorId}` : '#'} className='text-xs font-semibold text-foreground hover:underline'>{post?.author?.username}</Link>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className='cursor-pointer ' />
                </DialogTrigger>

                <DialogContent className='flex flex-col items-center text-center'>
                  <DialogTitle className='sr-only'>Post options</DialogTitle>
                  {!isOwnPost && (
                    <Button onClick={followOrUnfollowAuthorHandler} variant='ghost' className='cursor-pointer w-fit text-[#ED4956] font-bold'>
                      {isFollowingAuthor ? 'Unfollow' : 'Follow'}
                    </Button>
                  )}
                  <Button onClick={bookmarkHandler} variant='ghost' className='cursor-pointer w-fit'>
                    {isPostBookmarked ? 'Remove from Favourites' : 'Add to Favourites'}
                  </Button>
                  {isOwnPost && (
                    <Button onClick={deletePostHandler} variant='ghost' className='cursor-pointer w-fit font-bold'>
                      Delete
                    </Button>
                  )}
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
                  <p className='text-sm text-foreground'>
                    <span className='font-semibold mr-2'>{comment.author?.username}</span>
                    {comment.text}
                  </p>
                </div>
              )) : (
                <p className='text-sm text-muted-foreground'>No comments yet.</p>
              )}
            </div>

            <div className='shrink-0 border-t border-border p-4'>
              <div className='flex items-center gap-2'> 
                <input value={text} onChange={changeEventHandler} type="text" placeholder="Add a comment..." className='w-full min-w-0 rounded-lg border border-input bg-background p-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30' />
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
