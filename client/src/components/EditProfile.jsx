import { Link, useNavigate } from "react-router-dom"
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
            const res = await axios.post('http://localhost:8000/api/v1/user/profile/edit',formData,{
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
        <div className='flex max-w-2xl mx-auto pl-10'>
            <section className='flex flex-col gap-6 w-full my-8'>
                <h1 className='font-bold text-xl'>Edit Profile</h1>
                <div className='flex justify-between items-center gap-4'>
                    <div className='bg-gray-100 rounded-xl p-4 flex items-center gap-3'>
                        <Avatar>
                            <AvatarImage src={user?.profilePicture} />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>



                        <div >
                            <h1 className='font-bold text-sm'>{user?.username}</h1>
                            <span className='text-gray-600 text-sm'>{user?.bio || "Bio Here..."}</span>
                        </div>

                        <input type="file" ref={imageRef} onChange={fileChangeHandler} className="hidden" name="current" id="" />
                        <Button onClick={() => imageRef?.current.click()} className='bg-[#0095F6] h-8 hover:bg-[#1e88ce]'>Change Photo</Button>

                    </div>


                </div>
                <div>
                    <h1 className="font-bold text-xl mb-2">Bio</h1>
                    <Textarea value={input.bio} onChange={(e)=>setInput({...input,bio:e.target.value})} name='bio' className='focus-visible:ring-transparent'></Textarea>
                </div>

                <div>
                    <h1 className="font-bold text-xl mb-2">Gender</h1>
                    <Select defaultValue={input.gender} onValueChange={selectChnageHandler}>
                        <SelectTrigger className="w-[180px]">
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
                            <Button className='w-fit bg-[#0095F6] h-8 hover:bg-[#1e88ce]' disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </Button>

                        ) : (
                              <Button onClick={editProfileHandler} className='w-fit bg-[#0095F6] h-8 hover:bg-[#1e88ce]'>Submit</Button>
                        )

                    }
                  
                </div>



            </section>
        </div>
    )
}

export default EditProfile
