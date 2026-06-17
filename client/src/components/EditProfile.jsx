import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from '../components/ui/button'
import { useRef, useState } from "react"
import { Textarea } from '../components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../components/ui/select'
import { toast } from "sonner"
import axios from 'axios'
import { Loader2 } from "lucide-react"
import { setAuthUser } from "../redux/authSlice"

const EditProfile = () => {
    const { user } = useSelector(store => store.auth)
    const imageRef = useRef()
    const [loading,setLoading] = useState(false)
    const [input,setInput] =useState({
        profilePhoto:user?.profilePicture,
        bio:user?.bio,
        gender:user?.gender

    })
    const navigate=useNavigate()
    const dispatch=useDispatch()

    const fileChangeHandler =  (e) =>{

        const file = e.target.files?.[0]
        if(file) setInput({...input,profilePhoto:file})

    }

    const selectChnageHandler = (value) =>{
        setInput({...input,gender:value})
    }

    const editProfileHandler = async()=>{
        const formData = new FormData()
        formData.append("bio",input.bio)
        formData.append("gender",input.gender)
        if(input.profilePhoto) formData.append("profilePicture",input.profilePhoto)
        
        try {
            setLoading(true)
            const res = await axios.post('/api/v1/user/profile/edit',formData,{
                headers:{
                    'Content-Type':'multipart/form-data'
                },
                withCredentials:true
            })

            if(res.data.success) {
                const updatedData = {
                    ...user,
                    bio:res.data.user?.bio,
                    profilePicture:res.data.user?.profilePicture,
                    gender:res.data.user?.gender
                }
                dispatch(setAuthUser(updatedData))
                navigate(`/profile/${user?._id}`)
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className='mx-auto flex w-full max-w-2xl px-4 py-6 sm:px-6 lg:px-8'>
            <section className='flex w-full flex-col gap-6'>
                <h1 className='font-bold text-xl'>Edit Profile</h1>
                <div className='flex items-center gap-4'>
                    <div className='glass-panel flex w-full flex-col gap-4 rounded-xl p-4 sm:flex-row sm:items-center sm:justify-between'>
                        <div className='flex min-w-0 items-center gap-3'>
                        <Avatar>
                            <AvatarImage src={user?.profilePicture} />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>

                        <div className='min-w-0'>
                            <h1 className='font-bold text-sm'>{user?.username}</h1>
                            {user?.bio && <span className='block truncate text-sm text-muted-foreground'>{user.bio}</span>}
                        </div>
                        </div>

                        <input type="file" ref={imageRef} onChange={fileChangeHandler} className="hidden" name="current" id="" />
                        <Button onClick={() => imageRef?.current.click()} className='h-8 bg-primary hover:bg-primary/90'>Change Photo</Button>

                    </div>


                </div>
                <div>
                    <h1 className="font-bold text-xl mb-2">Bio</h1>
                    <Textarea value={input.bio} onChange={(e)=>setInput({...input,bio:e.target.value})} name='bio' className='focus-visible:ring-transparent'></Textarea>
                </div>

                <div>
                    <h1 className="font-bold text-xl mb-2">Gender</h1>
                    <Select defaultValue={input.gender} onValueChange={selectChnageHandler}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="male">X chromosome</SelectItem>
                                <SelectItem value="female">XY chromosome</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    {
                        loading ? (
                            <Button className='h-8 w-fit bg-primary hover:bg-primary/90' disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </Button>

                        ) : (
                              <Button onClick={editProfileHandler} className='h-8 w-fit bg-primary hover:bg-primary/90'>Submit</Button>
                        )

                    }
                  
                </div>



            </section>
        </div>
    )
}

export default EditProfile
