import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { Avatar,AvatarFallback,AvatarImage } from "./ui/avatar"

const EditProfile = () => {
     const {user} = useSelector(store=>store.auth)
  return (
    <div>
        <section>
            <h1 className='font-bold text-xl'>Edit Profile</h1>

             <div className='flex items-center gap-3'>

        <Link to={`/profile/${user?._id}`}>
        <Avatar>
          <AvatarImage src={user?.profilePicture} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        </Link>
        

        <div >
          <h1 className='font-semibold text-sm'><Link to={`/profile/${user?._id}`}>{user?.username}</Link></h1>
          <span className='text-gray-600 text-sm'>{user?.bio || "Bio Here..."}</span>
        </div>

      </div>

        </section>
    </div>
  )
}

export default EditProfile
