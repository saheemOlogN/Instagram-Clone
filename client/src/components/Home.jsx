import { Outlet } from 'react-router-dom'
import Feed from './Feed'
import RightSideBar from './RightSideBar'
import useGetAllPost from '../redux/hooks/useGetAllPost'
import useSuggestedUsers from '../redux/hooks/useGetSuggestedUsers'

const Home = () => {
  useGetAllPost()
  useSuggestedUsers()
  return (
    <div className='flex'>
        <div className='flex-grow '>
            <Feed />
            <Outlet />
        </div>
        <RightSideBar />
    </div>
  )
}

export default Home
