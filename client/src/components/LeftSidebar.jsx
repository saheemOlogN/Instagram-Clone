import { useState } from 'react'
import { Home, LogOut, MessageCircle, PlusSquare, Search } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from "sonner";
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '../redux/authSlice'
import CreatePost from './CreatePost'
import { Dialog, DialogContent, DialogTitle } from './ui/dialog'
import { Input } from './ui/input'
import { Button } from './ui/button'
import ThemeToggle from './ThemeToggle'






const LeftSidebar = () => {
    const navigate = useNavigate()
    const { user } = useSelector(store => store.auth)
    const [open, setOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [searchText, setSearchText] = useState("")
    const [searchResult, setSearchResult] = useState(null)
    const [searchError, setSearchError] = useState("")
    const [searchLoading, setSearchLoading] = useState(false)
    const dispatch = useDispatch()
    const sideBarHandler = (textType) => {
        if (textType == 'Logout') logoutHandler()
        else if (textType == 'Create') setOpen(true)
        else if (textType == 'Profile' && user?._id) navigate(`/profile/${user._id}`)
        else if (textType == 'Home') navigate("/")
        else if (textType === 'Messages') navigate("/chat")
        else if (textType === 'Search') setSearchOpen(true)
    }

    const logoutHandler = async () => {

        try {
            const res = await axios.get("/api/v1/user/logout", { withCredentials: true })
            if (res.data.success) {
                dispatch(setAuthUser(null))

                navigate("/signin")
                toast.success(res.data.message || "Logged out successfully")


            }
        } catch (error) {
            toast.error(error.response.data.message)
        }

    }

    const searchUserHandler = async (e) => {
        e.preventDefault()
        const username = searchText.trim()
        if (!username) return

        try {
            setSearchLoading(true)
            setSearchResult(null)
            setSearchError("")
            const res = await axios.get(`/api/v1/user/search?username=${encodeURIComponent(username)}`, { withCredentials: true })

            if (res.data.success) {
                setSearchResult(res.data.user)
            }
        } catch (error) {
            const message = error.response?.data?.message || "User not found"
            setSearchError(message)
            toast.error(message)
        } finally {
            setSearchLoading(false)
        }
    }

    const openUserProfile = (userId) => {
        setSearchOpen(false)
        setSearchText("")
        setSearchResult(null)
        setSearchError("")
        navigate(`/profile/${userId}`)
    }


    const sidebarItems = [
        { icon: <Home />, text: "Home" },
        { icon: <Search />, text: "Search" },
        { icon: <MessageCircle />, text: "Messages" },
        { icon: <PlusSquare />, text: "Create" },
        {
            icon: (
                <Avatar size='sm' className='self-center'>
                    <AvatarImage src={user?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            ), text: "Profile"
        },
        { icon: <LogOut />, text: "Logout" },


    ]
    return (
        <div className='fixed inset-x-3 bottom-3 z-30 lg:inset-y-4 lg:left-4 lg:right-auto lg:w-64'>

            <div className='glass-panel flex h-16 items-center justify-around rounded-2xl px-2 lg:h-full lg:flex-col lg:items-stretch lg:justify-start lg:p-4'>
                <div className='hidden items-center justify-between lg:flex'>
                    <h1 className='px-3 py-4 text-2xl font-bold tracking-tight'>Rizzgram</h1>
                    <ThemeToggle />
                </div>
                <div className='flex w-full items-center justify-around lg:mt-6 lg:block lg:space-y-1'>
                    {
                        sidebarItems.map((item, index) => {
                            return (
                                <div onClick={() => sideBarHandler(item.text)} key={index} className='glass-hover relative flex cursor-pointer items-center justify-center gap-3 rounded-xl p-3 text-sm font-medium text-sidebar-foreground lg:justify-start'>
                                    {item.icon}
                                    <span className='hidden lg:inline'>{item.text}</span>
                                </div>
                            )
                        })
                    }
                </div>
                <div className='lg:mt-auto lg:hidden'>
                    <ThemeToggle />
                </div>

            </div>
            <CreatePost open={open} setOpen={setOpen} />
            <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
                <DialogContent className='sm:max-w-md'>
                    <DialogTitle>Search user</DialogTitle>
                    <form onSubmit={searchUserHandler} className='flex items-center gap-2'>
                        <Input
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder='Enter username'
                            className='focus-visible:ring-transparent'
                        />
                        <Button disabled={searchLoading || !searchText.trim()} type='submit'>
                            {searchLoading ? 'Searching' : 'Search'}
                        </Button>
                    </form>

                    {searchResult && (
                        <button onClick={() => openUserProfile(searchResult._id)} className='flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted'>
                            <Avatar>
                                <AvatarImage src={searchResult.profilePicture} />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className='font-semibold text-sm'>{searchResult.username}</p>
                                {searchResult.bio && <p className='text-sm text-muted-foreground'>{searchResult.bio}</p>}
                            </div>
                        </button>
                    )}
                    {searchError && !searchResult && (
                        <p className='text-sm text-muted-foreground'>{searchError}</p>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default LeftSidebar
