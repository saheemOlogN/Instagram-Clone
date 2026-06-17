import { useEffect, useState } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import useGetUserProfile from '../redux/hooks/useGetUserProfile'
import { Link,useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Heart,AtSign, MessageCircle } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
import { setAuthUser, setUserProfile } from '../redux/authSlice'
import { Dialog, DialogContent, DialogTitle } from './ui/dialog'
import CommentDialog from './CommentDialog'
import { setPosts } from '../redux/postSlice'

const Profile = () => {
    const params = useParams()
    const userId = params.id
    useGetUserProfile(userId)

    const dispatch = useDispatch()
    const { user, userProfile } = useSelector(store => store.auth)
    const { posts } = useSelector(store => store.post)
    const isLoggedInUser = user?._id === userProfile?._id;
    const getId = (item) => typeof item === 'string' ? item : item?._id
    const isFollowing = user?.following?.some(item => getId(item) === userProfile?._id)

    const [activeTab,setActiveTab] =useState('posts')
    const [followLoading,setFollowLoading] = useState(false)
    const [connectionsOpen,setConnectionsOpen] = useState(false)
    const [connectionsType,setConnectionsType] = useState('followers')
    const [selectedPost,setSelectedPost] = useState(null)
    const [selectedPostOpen,setSelectedPostOpen] = useState(false)
    const [selectedPostComments,setSelectedPostComments] = useState([])
    const [postText,setPostText] = useState('')

    const handleTabChange = (tab) =>{
        setActiveTab(tab)
    }

    const followOrUnfollowHandler = async () =>{
        if (!user?._id || !userProfile?._id || followLoading) return

        try {
            setFollowLoading(true)
            const res = await axios.post(
                `/api/v1/user/followunfollow/${userProfile._id}`,
                {},
                { withCredentials: true }
            )

            if (res.data.success) {
                const nextFollowing = res.data.following
                    ? [...(user.following || []), userProfile._id]
                    : (user.following || []).filter(id => getId(id) !== userProfile._id)

                const nextFollowers = res.data.following
                    ? [...(userProfile.followers || []), user]
                    : (userProfile.followers || []).filter(id => getId(id) !== user._id)

                dispatch(setAuthUser({ ...user, following: nextFollowing }))
                dispatch(setUserProfile({ ...userProfile, followers: nextFollowers }))
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong")
        } finally {
            setFollowLoading(false)
        }
    }

    const displayedPost = activeTab === 'posts'
        ? userProfile?.posts || []
        : (isLoggedInUser ? userProfile?.bookmarks || user?.bookmarks || [] : userProfile?.bookmarks || [])
    const connections = connectionsType === 'followers'
        ? userProfile?.followers || []
        : userProfile?.following || []

    useEffect(() => {
        if (!userProfile?._id) return

        const resolveConnections = async () => {
            const followers = userProfile.followers || []
            const following = userProfile.following || []
            const missingConnections = [...followers, ...following].filter(connection => {
                return getId(connection) && !connection?.username
            })

            if (missingConnections.length === 0) return

            try {
                const uniqueIds = [...new Set(missingConnections.map(getId))]
                const responses = await Promise.all(
                    uniqueIds.map(id => axios.get(`/api/v1/user/${id}/profile`, { withCredentials: true }))
                )
                const usersById = responses.reduce((acc, res) => {
                    if (res.data.success) {
                        acc[res.data.user._id] = res.data.user
                    }
                    return acc
                }, {})

                dispatch(setUserProfile({
                    ...userProfile,
                    followers: followers.map(connection => usersById[getId(connection)] || connection),
                    following: following.map(connection => usersById[getId(connection)] || connection)
                }))
            } catch (error) {
                console.log(error.response?.data || error.message)
            }
        }

        resolveConnections()
    }, [userProfile, dispatch])

    const openConnections = (type) => {
        setConnectionsType(type)
        setConnectionsOpen(true)
    }

    const openPost = (post) => {
        if (!post?._id) return
        setSelectedPost(post)
        setSelectedPostComments(post.comments || [])
        setPostText('')
        setSelectedPostOpen(true)
    }

    const handlePostDialogChange = (open) => {
        setSelectedPostOpen(open)
        if (!open) {
            setSelectedPost(null)
            setSelectedPostComments([])
            setPostText('')
        }
    }

    const changePostTextHandler = (e) => {
        const value = e.target.value
        setPostText(value.trim() ? value : '')
    }

    const updateProfilePost = (postId, changes) => {
        if (!userProfile) return
        const updateCollection = (collection = []) => collection.map(post => (
            post?._id === postId ? { ...post, ...changes } : post
        ))

        dispatch(setUserProfile({
            ...userProfile,
            posts: updateCollection(userProfile.posts),
            bookmarks: updateCollection(userProfile.bookmarks)
        }))

        if (selectedPost?._id === postId) {
            setSelectedPost(prev => prev ? { ...prev, ...changes } : prev)
        }
    }

    const selectedAuthorId = getId(selectedPost?.author)
    const selectedIsOwnPost = user?._id === selectedAuthorId
    const selectedIsPostBookmarked = user?.bookmarks?.some(bookmark => getId(bookmark) === selectedPost?._id)
    const selectedIsFollowingAuthor = user?.following?.some(item => getId(item) === selectedAuthorId)

    const profileCommentHandler = async () => {
        if (!selectedPost?._id || !postText.trim()) return

        try {
            const res = await axios.post(
                `/api/v1/post/${selectedPost._id}/comment`,
                { text: postText },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            )

            if (res.data.success) {
                const nextComments = [...selectedPostComments, res.data.comment]
                setSelectedPostComments(nextComments)
                updateProfilePost(selectedPost._id, { comments: nextComments })
                dispatch(setPosts(posts.map(post => post._id === selectedPost._id ? { ...post, comments: nextComments } : post)))
                setPostText('')
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong")
        }
    }

    const profileBookmarkHandler = async () => {
        if (!user?._id || !selectedPost?._id) return

        try {
            const res = await axios.get(`/api/v1/post/${selectedPost._id}/bookmark`, {
                withCredentials: true
            })

            if (res.data.success) {
                const nextBookmarks = selectedIsPostBookmarked
                    ? (user.bookmarks || []).filter(bookmark => getId(bookmark) !== selectedPost._id)
                    : [...(user.bookmarks || []), selectedPost]

                dispatch(setAuthUser({ ...user, bookmarks: nextBookmarks }))

                if (isLoggedInUser) {
                    dispatch(setUserProfile({ ...userProfile, bookmarks: nextBookmarks }))
                }

                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong")
        }
    }

    const profileFollowOrUnfollowHandler = async () => {
        if (!user?._id || !selectedAuthorId || selectedIsOwnPost) return

        try {
            const res = await axios.post(
                `/api/v1/user/followunfollow/${selectedAuthorId}`,
                {},
                { withCredentials: true }
            )

            if (res.data.success) {
                const nextFollowing = res.data.following
                    ? [...(user.following || []), selectedAuthorId]
                    : (user.following || []).filter(id => getId(id) !== selectedAuthorId)

                dispatch(setAuthUser({ ...user, following: nextFollowing }))
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong")
        }
    }

    const profileDeletePostHandler = async () => {
        if (!selectedPost?._id) return

        try {
            const res = await axios.delete(`/api/v1/post/delete/${selectedPost._id}`, {
                withCredentials: true
            })

            if (res.data.success) {
                dispatch(setPosts(posts.filter(post => post._id !== selectedPost._id)))
                dispatch(setUserProfile({
                    ...userProfile,
                    posts: (userProfile.posts || []).filter(post => post._id !== selectedPost._id),
                    bookmarks: (userProfile.bookmarks || []).filter(post => post._id !== selectedPost._id)
                }))
                handlePostDialogChange(false)
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete post")
        }
    }

    return (

        <div className='mx-auto flex w-full max-w-5xl justify-center px-4 py-6 sm:px-6 lg:px-8'>
            <div className='flex w-full flex-col gap-8'>
                <section className='glass-panel grid gap-8 rounded-2xl p-6 sm:p-8 md:grid-cols-[180px_1fr]'>
                    <div className='flex justify-center md:justify-start'>
                        <Avatar className='h-28 w-28 sm:h-32 sm:w-32'>
                            <AvatarImage src={userProfile?.profilePicture} />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </div>

                    <div>
                        <div className='flex flex-col gap-5'>
                            <span className='text-center text-2xl font-semibold tracking-tight md:text-left'>{userProfile?.username}</span>
                            {
                                isLoggedInUser ? (
                                    <div className='flex flex-wrap items-center justify-center gap-3 md:justify-start'>
                                       <Link to='/account/edit'><Button variant='secondary' className='h-8 hover:bg-secondary/80'>Edit Profile</Button></Link>
                                        <Button variant='secondary' className='h-8 hover:bg-secondary/80'>View Profile</Button>
                                    </div>

                                ) : (
                                    isFollowing ? (
                                        <div className='flex flex-wrap items-center justify-center gap-3 md:justify-start'>
                                            <Button onClick={followOrUnfollowHandler} disabled={followLoading} variant='secondary' className='h-8 hover:bg-secondary/80'>
                                                {followLoading ? 'Please wait...' : 'Unfollow'}
                                            </Button>
                                            <Button variant='secondary' className='h-8 hover:bg-secondary/80'>Message</Button>
                                        </div>
                                    ) : (
                                        <div className='flex flex-wrap items-center justify-center gap-3 md:justify-start'>
                                            <Button onClick={followOrUnfollowHandler} disabled={followLoading} className='h-8 bg-primary text-primary-foreground hover:bg-primary/90'>
                                                {followLoading ? 'Please wait...' : 'Follow'}
                                            </Button>
                                            <Button variant='secondary' className='h-8 hover:bg-secondary/80'>Message</Button>
                                        </div>
                                    )
                                )
                            }
                            <div className='grid grid-cols-3 gap-2 text-center text-sm sm:flex sm:items-center sm:justify-center sm:gap-10 md:justify-start'>
                                <p><span className='font-semibold'>{userProfile?.posts?.length || 0} </span><span className='text-muted-foreground'>Posts</span></p>
                                <button onClick={() => openConnections('followers')} className='cursor-pointer'>
                                    <span className='font-semibold'>{userProfile?.followers?.length || 0} </span><span className='text-muted-foreground'>Followers</span>
                                </button>
                                <button onClick={() => openConnections('following')} className='cursor-pointer'>
                                    <span className='font-semibold'>{userProfile?.following?.length || 0} </span><span className='text-muted-foreground'>Following</span>
                                </button>
                            </div>
                        </div>

                        <div className='mt-6 flex flex-col items-center gap-3 md:items-start'>
                            <span className='font-semibold'>{userProfile?.bio}</span>
                            <Badge className='w-fit' variant='secondary'><AtSign />{userProfile?.username}</Badge>
                        </div>
                    </div>
                </section>

                <section className='glass-panel rounded-2xl p-4 sm:p-6'>
                    <div className='flex items-center justify-center gap-10 border-b border-border text-sm'>
                        <span className={`py-3 cursor-pointer ${activeTab === 'posts' ? 'font-bold text-foreground' : 'text-muted-foreground'}`} onClick={()=>{handleTabChange('posts')}}>
                            POSTS
                        </span>

                         <span className={`py-3 cursor-pointer ${activeTab === 'saved' ? 'font-bold text-foreground' : 'text-muted-foreground'}`}  onClick={()=>{handleTabChange('saved')}}>
                            SAVED
                        </span>
                    </div>

                    <div className='mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3'>
                        {
                            displayedPost?.map((post)=>{
                                return(
                                    <button key={post._id} onClick={() => openPost(post)} className='group relative cursor-pointer overflow-hidden rounded-lg border border-border bg-muted text-left'>
                                        <img src={post.image} alt="Post" className='w-full aspect-square object-cover' />

                                        <div className='absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
                                            <div className='flex items-center text-white space-x-4'>
                                                <span className='flex items-center gap-2'>
                                                  <Heart />
                                                    <span>{post?.likes?.length || 0}</span>
                                                </span>

                                                 <span className='flex items-center gap-2'>
                                                  <MessageCircle />
                                                    <span>{post?.comments?.length || 0}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </button>
                                )
                            })
                        }
                    </div>
                </section>
            </div>
            <Dialog open={connectionsOpen} onOpenChange={setConnectionsOpen}>
                <DialogContent className='glass-panel sm:max-w-md'>
                    <DialogTitle className='capitalize'>{connectionsType}</DialogTitle>
                    <div className='max-h-80 overflow-y-auto'>
                        {connections.length > 0 ? connections.map((connection) => (
                            <Link
                                key={getId(connection)}
                                onClick={() => setConnectionsOpen(false)}
                                to={`/profile/${getId(connection)}`}
                                className='glass-hover flex w-full items-center gap-3 rounded-lg p-3 text-left'
                            >
                                <Avatar>
                                    <AvatarImage src={connection?.profilePicture} />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className='font-semibold text-sm'>{connection?.username || 'Loading user...'}</p>
                                    {connection?.bio && <p className='text-sm text-muted-foreground'>{connection.bio}</p>}
                                </div>
                            </Link>
                        )) : (
                            <p className='text-sm text-muted-foreground'>No {connectionsType} yet.</p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
            {selectedPost && (
                <CommentDialog
                    open={selectedPostOpen}
                    setOpen={handlePostDialogChange}
                    post={selectedPost}
                    comments={selectedPostComments}
                    text={postText}
                    changeEventHandler={changePostTextHandler}
                    commentHandler={profileCommentHandler}
                    bookmarkHandler={profileBookmarkHandler}
                    followOrUnfollowAuthorHandler={profileFollowOrUnfollowHandler}
                    isOwnPost={selectedIsOwnPost}
                    isPostBookmarked={selectedIsPostBookmarked}
                    isFollowingAuthor={selectedIsFollowingAuthor}
                    deletePostHandler={profileDeletePostHandler}
                />
            )}

        </div>
    )
}

export default Profile
