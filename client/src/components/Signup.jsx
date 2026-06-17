import { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const signupEasterEggs = [
    "New account, new lore.",
    "Claim your username before the opps do.",
    "Fresh profile. Zero crumbs.",
    "Certified yap zone access pending.",
]


const Signup = () => {
    const navigate = useNavigate()
    const { user } = useSelector(store=>store.auth)
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
            const res = await axios.post('/api/v1/user/register', input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            })

            if (res.data.success) {
                toast.success(res.data.message)
                setInput({
                    username: "",
                    email: "",
                    password: ""
                })
                navigate("/signin")
            }

        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Something went wrong")
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(()=>{
        if(user) navigate("/")
    },[user, navigate])

    const easterEgg = signupEasterEggs[input.username.length % signupEasterEggs.length]

    return (
        <div className='flex min-h-screen w-full items-center justify-center px-4 py-10'>
            <form onSubmit={signupHandler} className='glass-panel flex w-full max-w-md flex-col gap-5 rounded-2xl p-8'>
                <div className='my-4'>
                    <h1 className='text-center text-3xl font-bold tracking-tight'>Rizzgram</h1>
                    <p className='text-center text-sm text-muted-foreground'>Create your account</p>
                    <p className='mt-2 text-center text-xs font-medium text-primary'>{easterEgg}</p>
                </div>

                <div>
                    <span className='font-medium'>Username</span>
                    <Input
                        type="text"
                        className='my-2 bg-background focus-visible:ring-primary'
                        name="username"
                        value={input.username}
                        onChange={changeEventHandler}
                    />
                </div>

                <div>
                    <span className='font-medium'>Email</span>
                    <Input
                        type="email"
                        className='my-2 bg-background focus-visible:ring-primary'
                        name="email"
                        value={input.email}
                        onChange={changeEventHandler}
                    />
                </div>

                <div>
                    <span className='font-medium'>Password</span>
                    <Input
                        type="password"
                        className='my-2 bg-background focus-visible:ring-primary'
                        name="password"
                        value={input.password}
                        onChange={changeEventHandler}
                    />
                </div>
                <Button type='submit' disabled={loading}>{loading ? "Cooking your aura..." : "Sign Up"}</Button>
                <span className='text-center text-sm text-muted-foreground'>Already have an account? <Link to="/signin" className='font-semibold text-primary'>Login</Link></span>
            </form>
        </div>
    )
}

export default Signup
