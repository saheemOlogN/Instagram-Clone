import React from 'react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import useGetUserProfile from '../redux/hooks/useGetUserProfile'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Button } from './ui/button'
const Profile = () => {
    const params = useParams()
    const userId = params.id
    useGetUserProfile(userId)

    const { userProfile } = useSelector(store => store.auth)
    //console.log(userProfile)

    return (

        <div className='flex max-w-4xl justify-center mx-auto pl-10'>
            <div className='flex flex-col gap-20 p-8'>
                <div className='grid grid-cols-2 '> 
                <section className='flex justify-center items-center'>
                    <Avatar className='h-32 w-32'>
                        <AvatarImage  src={userProfile?.profilePicture} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>

                </section>
                <section>
                    <div className='flex flex-col gap-5'>
                        <span>{userProfile?.username}</span>
                        <div className='flex items-center gap-4'>
                        <Button variant='secondary' className='hover:bg-gray-200 h-8 '>Edit Profile</Button>
                        <Button variant='secondary' className='hover:bg-gray-200 h-8 '>View Profile</Button>
                       </div>
                    </div>
                </section>
            </div>


            </div>
            
        </div>
    )
}

export default Profile