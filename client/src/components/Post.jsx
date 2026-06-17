import { useState } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog'
import { MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";
import { FaBookmark, FaRegBookmark } from "react-icons/fa6";
import CommentDialog from './CommentDialog'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import { setPosts } from '../redux/postSlice'
import { setAuthUser } from '../redux/authSlice'
import {Badge} from './ui/badge'

const Post = ({ post }) => {
    const [text, setText] = useState("")
    const [open, setOpen] = useState(false)
    const { user } = useSelector(store => store.auth)
    const { posts } = useSelector(store => store.post)
    const dispatch = useDispatch()
    const [liked, setLiked] = useState(post.likes.includes(user?._id) || false)
    const [postLike, setPostLike] = useState(post.likes.length)
    const [comment, setComment] = useState(post.comments)
    const [isLikePending, setIsLikePending] = useState(false)
    const getBookmarkId = (bookmark) => typeof bookmark === 'string' ? bookmark : bookmark?._id
    const getId = (item) => typeof item === 'string' ? item : item?._id
    const authorId = getId(post.author)
    const isOwnPost = user?._id === authorId
    const isPostBookmarked = user?.bookmarks?.some(bookmark => getBookmarkId(bookmark) === post._id)
    const isFollowingAuthor = user?.following?.some(item => getId(item) === authorId)

    const changeEventHandler = (e) => {
        const inputText = e.target.value;

        if (inputText.trim()) {
            setText(inputText)
        }
        else {
            setText("")
        }

    }
    const updatePostLikes = (nextLiked) => {
        const updatedPostData = posts.map(p => p._id === post._id ? {
            ...p,
            likes: nextLiked
                ? (p.likes.includes(user._id) ? p.likes : [...p.likes, user._id])
                : p.likes.filter(id => id != user._id)
        } : p)
        dispatch(setPosts(updatedPostData))
    }

    const likeOrDislikeHandler = async () => {
        if (isLikePending || !user?._id) return

        const nextLiked = !liked
        const nextPostLike = nextLiked ? postLike + 1 : postLike - 1

        setIsLikePending(true)
        setLiked(nextLiked)
        setPostLike(nextPostLike)
        updatePostLikes(nextLiked)

        try {

            const action = nextLiked ? 'like' : 'dislike'
            const res = await axios.get(`/api/v1/post/${post._id}/${action}`, { withCredentials: true })
            if (!res.data.success) {
                throw new Error(res.data.message)
            }
        } catch (error) {
            setLiked(!nextLiked)
            setPostLike(postLike)
            updatePostLikes(!nextLiked)
            toast.error(error.response?.data?.message || error.message || "Something went wrong")
        } finally {
            setIsLikePending(false)
        }
    }

    const deletePostHandler = async () => {
        try {
            const res = await axios.delete(`/api/v1/post/delete/${post._id}`, { withCredentials: true })
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
            const res = await axios.post(`/api/v1/post/${post._id}/comment`,
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

    const bookmarkHandler = async () =>{
        if (!user?._id) return

        try {
            const res = await axios.get(`/api/v1/post/${post?._id}/bookmark`,
                {withCredentials:true}
            )
            
            if(res.data.success){
                toast.success(res.data.message)
                const updatedBookmarks = isPostBookmarked
                    ? user.bookmarks.filter(bookmark => getBookmarkId(bookmark) !== post._id)
                    : [...(user.bookmarks || []), post];
                dispatch(setAuthUser({ ...user, bookmarks: updatedBookmarks }));
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Something went wrong")
        }
    }

    const followOrUnfollowAuthorHandler = async () =>{
        if (!user?._id || !authorId || isOwnPost) return

        try {
            const res = await axios.post(
                `/api/v1/user/followunfollow/${authorId}`,
                {},
                { withCredentials: true }
            )

            if (res.data.success) {
                const updatedFollowing = res.data.following
                    ? [...(user.following || []), authorId]
                    : (user.following || []).filter(id => getId(id) !== authorId)

                dispatch(setAuthUser({ ...user, following: updatedFollowing }))
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong")
        }
    }

    return (
        <article className='glass-panel my-6 w-full max-w-xl overflow-hidden rounded-2xl p-4 sm:p-5'>
            <div className='flex items-center justify-between'>

                <div className='flex items-center gap-2'>
                    <Avatar>
                        <AvatarImage src={post.author?.profilePicture} alt='' />
                        <AvatarFallback>CN</AvatarFallback>

                    </Avatar>
                    <div className='flex items-center gap-3'>
                        <Link to={`/profile/${authorId}`} className='font-semibold text-foreground hover:underline'>
                            {post.author?.username}
                        </Link>
                        {user?._id === post.author?._id && <Badge variant="secondary">Author</Badge> }
                        

                    </div>
                    
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className='cursor-pointer' />

                    </DialogTrigger>
                    <DialogContent className='glass-panel flex flex-col items-center text-sm text-center'>
                        <DialogTitle className='sr-only'>Post options</DialogTitle>
                        {!isOwnPost && (
                            <Button onClick={followOrUnfollowAuthorHandler} variant='ghost' className='cursor-pointer w-fit text-[#ED4956]'>
                                {isFollowingAuthor ? 'Unfollow' : 'Follow'}
                            </Button>
                        )}
                        <Button onClick={bookmarkHandler} variant='ghost' className='cursor-pointer w-fit'>
                            {isPostBookmarked ? 'Remove from Favourites' : 'Add to Favourites'}
                        </Button>

                        {isOwnPost && (
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
                            <FaRegHeart onClick={likeOrDislikeHandler} className='cursor-pointer hover:text-muted-foreground' />
                    }
                    <FiMessageCircle onClick={() => setOpen(true)} className='cursor-pointer hover:text-muted-foreground' />
                </div>

                {
                    isPostBookmarked ? (
                        <FaBookmark onClick={bookmarkHandler} className='cursor-pointer text-foreground hover:text-muted-foreground' />
                    ) : (
                        <FaRegBookmark onClick={bookmarkHandler} className='cursor-pointer hover:text-muted-foreground' />
                    )
                }
            </div>
            <span className='font-medium block mb-1'>{postLike} likes</span>

            <p className='text-sm leading-6'>
                <Link to={`/profile/${authorId}`} className='mr-3 font-medium hover:underline'>
                    {post.author?.username}
                </Link>
                {post.caption}
            </p>
            {
                comment.length > 0 && (
                    <span onClick={() => setOpen(true)} className='mt-1 block cursor-pointer text-sm text-muted-foreground'>View All {comment?.length || 0} comments</span>

                )
            }

            <CommentDialog
                open={open}
                setOpen={setOpen}
                post={post}
                comments={comment}
                text={text}
                changeEventHandler={changeEventHandler}
                commentHandler={commentHandler}
                bookmarkHandler={bookmarkHandler}
                followOrUnfollowAuthorHandler={followOrUnfollowAuthorHandler}
                isOwnPost={isOwnPost}
                isPostBookmarked={isPostBookmarked}
                isFollowingAuthor={isFollowingAuthor}
                deletePostHandler={deletePostHandler}
            />
            <div className='flex justify-between'>
                <input type="text"
                    placeholder="Add a comment"
                    value={text}
                    onChange={changeEventHandler}
                    className='w-full bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground'
                />

                {
                    text && <span onClick={commentHandler} className='text-[#3BADF8] cursor-pointer'>Post</span>
                }
            </div>




        </article>


    )
}

export default Post
