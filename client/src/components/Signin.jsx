import { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { Link, useNavigate} from 'react-router-dom'
import { Loader2 } from "lucide-react";
import { useDispatch } from 'react-redux'
import { setAuthUser } from '../redux/authSlice'



const Signin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
    const [input, setInput] = useState({
        username: "",
        email: "",
        password: ""
    })
    const [loading, setLoading] = useState(false)

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
    }

    const signupHandler = async (e) => {
        e.preventDefault()
        console.log(input)
        try {
            setLoading(true)
            const res = await axios.post('http://localhost:8000/api/v1/user/login', input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            })

            if (res.data.success) {
                dispatch(setAuthUser(res.data.user))
                toast.success(res.data.message)
                setInput({
                    username: "",
                    email: "",
                    password: ""
                })
                navigate("/")
            }

        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Something went wrong")
        }
        finally {
            setLoading(false)
        }

    }
    return (
        <div className='flex items-center w-screen h-screen justify-center'>
            <form onSubmit={signupHandler} className='shadow-lg flex flex-col gap-5 p-8 '>
                <div className='my-4'>
                    <h1 className='text-center font-bold text-xl'>Rizzgram</h1>
                    <p className='text-center text-sm'>Signin </p>
                </div>


                <div>
                    <span className='font-medium'>Email</span>
                    <Input
                        type="email"
                        className='focus-visible:ring-transparent my-2'
                        name="email"
                        value={input.email}
                        onChange={changeEventHandler}
                    />
                </div>

                <div>
                    <span className='font-medium'>Password</span>
                    <Input
                        type="password"
                        className='focus-visible:ring-transparent my-2'
                        name="password"
                        value={input.password}
                        onChange={changeEventHandler}
                    />
                </div>
                {
                  loading ? (
                    <Button>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    </Button>
                  ) :(
                    <Button type='submit' >Login</Button>
                  )
                }
    
                 <span className='text-center'>Dont have an account? <Link to="/signup" className='text-blue-700'>Create one</Link></span>
            </form>
        </div>
    )
}

export default Signin
