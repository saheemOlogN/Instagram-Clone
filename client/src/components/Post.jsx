import { useState } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog'
import { MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";
import { IoIosSend } from "react-icons/io";
import { FaRegBookmark } from "react-icons/fa6";
import CommentDialog from './CommentDialog'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { setPosts } from '../redux/postSlice'

const Post = ({ post }) => {
    const [text, setText] = useState("")
    const [open, setOpen] = useState(false)
    const { user } = useSelector(store => store.auth)
    const { posts } = useSelector(store => store.post)
    const dispatch = useDispatch()
    const [liked, setLiked] = useState(post.likes.includes(user?._id) || false)
    const [postLike, setPostLike] = useState(post.likes.length)
    const [comment, setComment] = useState(post.comments)

    const changeEventHandler = (e) => {
        const inputText = e.target.value;

        if (inputText.trim()) {
            setText(inputText)
        }
        else {
            setText("")
        }

    }
    const likeOrDislikeHandler = async () => {
        try {

            const action = liked ? 'dislike' : 'like'
            const res = await axios.get(`http://localhost:8000/api/v1/post/${post._id}/${action}`, { withCredentials: true })
            if (res.data.success) {
                const updatedLikes = liked ? postLike - 1 : postLike + 1
                setPostLike(updatedLikes)
                setLiked(!liked)

                const updatedPostData = posts.map(p => p._id === post._id ? {
                    ...p,
                    likes: liked ? p.likes.filter(id => id != user._id) : [...p.likes, user._id]

                } : p)
                dispatch(setPosts(updatedPostData))
                toast.success(res.data.message)
            }
        } catch (error) {

        }
    }

    const deletePostHandler = async () => {
        try {
            const res = await axios.delete(`http://localhost:8000/api/v1/post/delete/${post._id}`, { withCredentials: true })
            if (res.data.success) {
                dispatch(setPosts(posts.filter((item) => item._id !== post._id)))
                toast.success(res.data.message)
            }
        }

        catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete post")
        }
    }

    const commentHandler = async () => {
        try {
            const res = await axios.post(`http://localhost:8000/api/v1/post/${post._id}/comment`,
                { text },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            )
            if (res.data.success) {
                const updatedCommentData = [...comment, res.data.comment]
                setComment(updatedCommentData)


                const updatedPostData = posts.map(p => p._id === post._id ? { ...p, comments: updatedCommentData } : p)

                dispatch(setPosts(updatedPostData))
                toast.success(res.data.message)
                setText("")
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong")
        }
    }

    return (
        <div className='my-8 w-full max-w-sm mx-auto'>
            <div className='flex items-center justify-between'>

                <div className='flex items-center gap-2'>
                    <Avatar>
                        <AvatarImage src={post.author?.profilePicture} alt='' />
                        <AvatarFallback>CN</AvatarFallback>

                    </Avatar>
                    <h1>{post.author?.username}</h1>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className='cursor-pointer' />

                    </DialogTrigger>
                    <DialogContent className='flex flex-col items-center text-sm text-center '>
                        <DialogTitle className='sr-only'>Post options</DialogTitle>
                        <Button variant='ghost' className='cursor-pointer w-fit text-[#ED4956]'>Unfollow</Button>
                        <Button variant='ghost' className='cursor-pointer w-fit'>Add to Favourites</Button>

                        {user && user._id === post.author?._id && (
                            <Button onClick={deletePostHandler} variant='ghost' className='cursor-pointer w-fit font-bold'>Delete</Button>
                        )}




                    </DialogContent>

                </Dialog>

            </div>
            <img
                className='rounded-sm my-2 w-full aspect-square object-cover'
                src={post.image} alt=""
            />



            <div className='flex items-center justify-between my-2'>
                <div className='flex items-center gap-3'>
                    {
                        liked ? <FaHeart onClick={likeOrDislikeHandler} className='cursor-pointer text-red-600' /> :
                            <FaRegHeart onClick={likeOrDislikeHandler} className='cursor-pointer hover:text-gray-600' />
                    }
                    <FiMessageCircle onClick={() => setOpen(true)} className='cursor-pointer hover:text-gray-600' />
                    <IoIosSend className='cursor-pointer hover:text-gray-600' />
                </div>

                <FaRegBookmark className='cursor-pointer hover:text-gray-600' />
            </div>
            <span className='font-medium block mb-1'>{postLike} likes</span>
                    
            <p>
                <span className='font-medium mr-3'>{post.author?.username}</span>
                {post.caption}
            </p>
            <span onClick={() => setOpen(true)}>View All {comment?.length || 0} comments</span>
            <CommentDialog open={open} setOpen={setOpen} post={post} comments={comment} text={text} changeEventHandler={changeEventHandler} commentHandler={commentHandler} />
            <div className='flex justify-between'>
                <input type="text"
                    placeholder="Add a comment"
                    value={text}
                    onChange={changeEventHandler}
                    className='outline-none text-sm w-full font-medium'
                />

                {
                    text && <span onClick={commentHandler} className='text-[#3BADF8] cursor-pointer'>Post</span>
                }
            </div>




        </div>


    )
}

export default Post
