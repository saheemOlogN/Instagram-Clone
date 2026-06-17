import { Outlet } from 'react-router-dom'
import Feed from './Feed'
import RightSideBar from './RightSideBar'
import useGetAllPost from '../redux/hooks/useGetAllPost'
import useSuggestedUsers from '../redux/hooks/useGetSuggestedUsers'

const Home = () => {
  useGetAllPost()
  useSuggestedUsers()
  return (
    <div className='mx-auto flex w-full max-w-7xl gap-8 px-4 py-6 sm:px-6 lg:px-8'>
        <div className='min-w-0 flex-1'>
            <Feed />
            <Outlet />
        </div>
        <RightSideBar />
    </div>
  )
}

export default Home
