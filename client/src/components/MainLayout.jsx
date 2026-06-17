import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'
const MainLayout = () => {
    return (
        <div className='min-h-screen'>
            <LeftSidebar />

            <main className='min-h-screen pb-24 lg:pb-0 lg:pl-72'>
                <Outlet />
            </main>
        </div>
    )
}

export default MainLayout
