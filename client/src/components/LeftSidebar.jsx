import React from 'react'
import { Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp,Heart } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from "sonner";

const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <PlusSquare />, text: "Create" },
    {
        icon: (
            <Avatar>
                <AvatarImage className='w-6 h-6' src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
        ), text: "Profile"
    },
    { icon: <LogOut />, text: "Logout" },


]




const LeftSidebar = () => {
    const navigate=useNavigate()
    const sideBarHandler = (textType)=>{
    if(textType=='Logout') logoutHandler()
}

    const logoutHandler = async()=>{
    
    try {
        const res=await axios.get("http://localhost:8000/api/v1/user/logout",{withCredentials:true})
        if(res.data.success) {
           navigate("/signin")
            toast.success(res.data.message || "Logged out successfully")


        }
    } catch (error) {
        toast.error(error.response.data.message)
    }

}
    return (
        <div className='fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen'>

            <div className='flex flex-col '>
                <h1 className='my-8 pl-3 font-bold text-xl'>Rizzgram</h1>
                <div>
                 {
                sidebarItems.map((item,index)=>{
                    return (
                        <div onClick={()=>sideBarHandler(item.text)} key={index} className='flex items-center gap-3 my-3 relative hover:bg-gray-100 rounded-lg p-3 '>
                            {item.icon}
                            {item.text}

                        </div>
                    )
                })
            }
            </div>

            </div>
           
        </div>
    )
}

export default LeftSidebar