import { useSelector } from 'react-redux'
import {Avatar,AvatarImage,AvatarFallback} from './ui/avatar'
import { Link } from 'react-router-dom'
import SuggestedUsers from './SuggestedUsers'

const RightSideBar = () => {
  const {user} = useSelector(store=>store.auth)
  return (
    <aside className='sticky top-6 hidden h-fit w-80 shrink-0 xl:block'>
      <div className='glass-panel rounded-2xl p-5'>
      <div className='flex items-center gap-3'>

        <Link to={`/profile/${user?._id}`}>
        <Avatar>
          <AvatarImage src={user?.profilePicture} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        </Link>
        

        <div >
          <h1 className='font-semibold text-sm'><Link to={`/profile/${user?._id}`}>{user?.username}</Link></h1>
          {user?.bio && <span className='text-muted-foreground text-sm'>{user.bio}</span>}
        </div>

      </div>

      <SuggestedUsers />
      </div>

    </aside>
  )
}

export default RightSideBar
