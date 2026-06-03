import { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'


const Signup = () => {
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
            const res = await axios.post('http://localhost:8000/api/v1/user/register', input, {
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
            }
            useNavigate("/signin")

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
                    <p className='text-center text-sm'>Signup To Start Rizzing </p>
                </div>

                <div>
                    <span className='font-medium'>Username</span>
                    <Input
                        type="text"
                        className='focus-visible:ring-transparent my-2'
                        name="username"
                        value={input.username}
                        onChange={changeEventHandler}
                    />
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
                <Button type='submit'>Sign Up</Button>
                <span className='text-center'>Already have an account? <Link to="/signin" className='text-blue-700'>Login</Link></span>
            </form>
        </div>
    )
}

export default Signup
