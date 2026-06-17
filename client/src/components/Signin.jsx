import { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { Link, useNavigate} from 'react-router-dom'
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '../redux/authSlice'

const loginEasterEggs = [
    "Stop gooning, start rizzing.",
    "Lock in. The feed misses you.",
    "Main character mode loading.",
    "Touch grass later. Sign in first.",
]



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
            const res = await axios.post('/api/v1/user/login', input, {
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
    const { user } = useSelector(store=>store.auth)
    const easterEgg = loginEasterEggs[input.email.length % loginEasterEggs.length]
 

    useEffect(()=>{
        if(user) navigate("/")
    },[user, navigate])
    return (
        <div className='flex min-h-screen w-full items-center justify-center px-4 py-10'>
            <form onSubmit={signupHandler} className='glass-panel flex w-full max-w-md flex-col gap-5 rounded-2xl p-6 sm:p-8'>
                <div className='my-4'>
                    <h1 className='text-center text-3xl font-bold tracking-tight'>Rizzgram</h1>
                    <p className='text-center text-sm text-muted-foreground'>Signin</p>
                    <p className='mt-2 text-center text-xs font-medium text-primary'>{easterEgg}</p>
                </div>


                <div>
                    <span className='font-medium'>Email</span>
                    <Input
                        type="email"
                        className='my-2 focus-visible:ring-primary'
                        name="email"
                        value={input.email}
                        onChange={changeEventHandler}
                    />
                </div>

                <div>
                    <span className='font-medium'>Password</span>
                    <Input
                        type="password"
                        className='my-2 focus-visible:ring-primary'
                        name="password"
                        value={input.password}
                        onChange={changeEventHandler}
                    />
                </div>
                {
                  loading ? (
                    <Button>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Start rizzing...
                    </Button>
                  ) :(
                    <Button type='submit' >Login</Button>
                  )
                }
    
                 <span className='text-center text-sm text-muted-foreground'>Dont have an account? <Link to="/signup" className='font-semibold text-primary'>Create one</Link></span>
            </form>
        </div>
    )
}

export default Signin
