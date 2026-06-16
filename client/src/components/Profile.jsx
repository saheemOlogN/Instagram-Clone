import { useState } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import useGetUserProfile from '../redux/hooks/useGetUserProfile'
import { Link,useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Heart,AtSign, MessageCircle } from 'lucide-react'

const Profile = () => {
    const params = useParams()
    const userId = params.id
    useGetUserProfile(userId)

    const { user, userProfile } = useSelector(store => store.auth)
    const isLoggedInUser = user?._id === userProfile?._id;
    const isFollowing = user?.following?.includes(userProfile?._id)

    const [activeTab,setActiveTab] =useState('posts')

    const handleTabChange = (tab) =>{
        setActiveTab(tab)
    }

    const displayedPost = activeTab === 'posts' ? userProfile?.posts || [] : userProfile?.bookmarks || []

    return (

        <div className='flex max-w-4xl justify-center mx-auto pl-10'>
            <div className='flex flex-col gap-20 p-8'>
                <div className='grid grid-cols-2 '>
                    <section className='flex justify-center items-center'>
                        <Avatar className='h-32 w-32'>
                            <AvatarImage src={userProfile?.profilePicture} />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>

                    </section>
                    <section>
                        <div className='flex flex-col gap-5'>
                            <span>{userProfile?.username}</span>
                            {
                                isLoggedInUser ? (
                                    <div className='flex items-center gap-4'>
                                       <Link to='/account/edit'><Button variant='secondary' className='hover:bg-gray-200 h-8 '>Edit Profile</Button></Link> 
                                        <Button variant='secondary' className='hover:bg-gray-200 h-8 '>View Profile</Button>
                                    </div>

                                ) : (
                                    isFollowing ? (
                                        <div className='flex items-center gap-4'>
                                            <Button variant='secondary' className='hover:bg-gray-200 h-8 '>Unfollow</Button>
                                            <Button variant='secondary' className='hover:bg-gray-200 h-8 '>Message</Button>


                                        </div>
                                    ) : (
                                        <div className='flex items-center gap-4'>
                                            <Button variant='secondary' className='bg-[#0095F6] hover:bg-[#078de7] h-8 '>Follow</Button>
                                            <Button variant='secondary' className='hover:bg-gray-200 h-8 '>Message</Button>
                                        </div>
                                    )



                                )
                            }
                            <div className='flex items-center justify-center gap-10'>
                                <p><span className='font-semibold'>{userProfile?.posts?.length || 0} </span><span> Posts</span></p>
                                <p><span className='font-semibold'>{userProfile?.followers?.length || 0} </span><span> Followers</span></p>
                                <p><span className='font-semibold'>{userProfile?.following?.length || 0} </span><span> Posts</span></p>
                            </div>

                        </div>

                        <div className='flex flex-col gap-3'>
                            <span className='font-semibold'>{userProfile?.bio || 'bio here....'}</span>
                            <Badge className='w-fit ' variant='secondary'><AtSign />{userProfile?.username}</Badge>
                        </div>
                    </section>
                </div>


                <div className='border-t border-t-gray-200'>
                    <div className='flex justify-center items-center gap-10 text-sm'>

                        <span className={`py-3 cursor-pointer ${activeTab === 'posts' ? 'font-bold ' : ''}`} onClick={()=>{handleTabChange('posts')}}>
                            POSTS
                        </span>

                         <span className={`py-3 cursor-pointer ${activeTab === 'saved' ? 'font-bold ' : ''}`}  onClick={()=>{handleTabChange('saved')}}>
                            SAVED
                        </span>

                    </div>

                    <div className='grid grid-cols-3 gap-3'>
                        {
                            displayedPost?.map((post)=>{
                                return(
                                    <div key={post._id} className='relative group cursor-pointer'>
                                        <img src={post.image} alt="Post" className='h-full w-full  object-cover my-2 w-full aspect-square object-cover' />

                                        <div className='absolute inset-0 flex items-center justify-center   bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity  duration-300'>
                                            <div className='flex items-center text-white space-x-4'>
                                                <button className='flex items-center gap-2 hover:text-gray-200'>
                                                  <Heart />
                                                    <span>{post?.likes?.length || 0}</span>
                                                </button>

                                                 <button className='flex items-center gap-2 hover:text-gray-200'>
                                                  <MessageCircle />
                                                    <span>{post?.comments?.length || 0}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    
                                )
                            })
                        }
                    </div>

                </div>


            </div>

        </div>
    )
}

export default Profile
