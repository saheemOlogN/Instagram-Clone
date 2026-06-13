import { useSelector } from 'react-redux'
import { Avatar, AvatarImage,AvatarFallback } from './ui/avatar'
import { Link } from 'react-router-dom'

const SuggestedUsers = () => {
    const { suggestedUsers } = useSelector(store => store.auth)
    const users = suggestedUsers || []
    return (
        <div className='my-10 '>
            <div className='flex items-center justify-between gap-3 my-5'>
                <h1 className='font-semibold text-gray-600 text-sm'>Suggested for you</h1>
                <span className='font-medium cursor-pointer'>See All</span>
            </div>
            {
                users.map((user) => {
                    return (
                        <div key={user._id}>
                            <div className='flex items-center gap-3 relative'>

                                <Link to={`/profile/${user?._id}`}>
                                    <Avatar>
                                        <AvatarImage src={user?.profilePicture} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </Link>


                                <div className=''>
                                    <h1 className='font-semibold text-sm'><Link to={`/profile/${user?._id}`}>{user?.username}</Link></h1>
                                    <span className='text-gray-600 text-sm'>{user?.bio || "Bio Here..."}</span>
                                </div>
                                <span className='absolute right-0 text-[#3BADF8] text-sm font-bold  cursor-pointer'>Follow</span>

                            </div>
                        </div>
                    )
                })
            }
        </div>
  )
}

export default SuggestedUsers
