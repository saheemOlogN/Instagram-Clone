import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarImage,AvatarFallback } from './ui/avatar'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import { setAuthUser, setSuggestedUsers } from '../redux/authSlice'

const SuggestedUsers = () => {
    const dispatch = useDispatch()
    const { user: authUser, suggestedUsers } = useSelector(store => store.auth)
    const getId = (item) => typeof item === 'string' ? item : item?._id
    const users = (suggestedUsers || []).filter(user => {
        return !(authUser?.following || []).some(id => getId(id) === user._id)
    })

    const followHandler = async (targetUserId) => {
        if (!authUser?._id) return

        try {
            const res = await axios.post(
                `/api/v1/user/followunfollow/${targetUserId}`,
                {},
                { withCredentials: true }
            )

            if (res.data.success) {
                const nextFollowing = res.data.following
                    ? [...(authUser.following || []), targetUserId]
                    : (authUser.following || []).filter(id => getId(id) !== targetUserId)

                dispatch(setAuthUser({
                    ...authUser,
                    following: nextFollowing
                }))
                dispatch(setSuggestedUsers(users.filter(user => user._id !== targetUserId)))
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong")
        }
    }

    return (
        <div className='mt-8'>
            <div className='mb-4 flex items-center justify-between gap-3'>
                <h1 className='text-sm font-semibold text-muted-foreground'>Suggested for you</h1>
                <span className='cursor-pointer text-sm font-medium text-foreground'>See All</span>
            </div>
            {
                users.map((user) => {
                    return (
                        <div key={user._id} className='rounded-xl'>
                            <div className='glass-hover relative flex items-center gap-3 rounded-xl p-2'>

                                <Link to={`/profile/${user?._id}`}>
                                    <Avatar>
                                        <AvatarImage src={user?.profilePicture} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </Link>


                                <div className='min-w-0 pr-14'>
                                    <h1 className='font-semibold text-sm'><Link to={`/profile/${user?._id}`}>{user?.username}</Link></h1>
                                    {user?.bio && <span className='block truncate text-sm text-muted-foreground'>{user.bio}</span>}
                                </div>
                                <span onClick={() => followHandler(user._id)} className='absolute right-2 cursor-pointer text-sm font-bold text-primary'>Follow</span>

                            </div>
                        </div>
                    )
                })
            }
        </div>
  )
}

export default SuggestedUsers
