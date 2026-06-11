import axios from "axios"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setPosts } from "../postSlice"
import {  setUserProfile } from "../authSlice"

const useGetUserProfile = (userId) =>{
    const dispatch = useDispatch()
    const { user } = useSelector(store => store.auth)
    useEffect(()=>{
        if (!user) return
        const fetchUserProfile = async ()=>{
            try {
                const res = await axios.get(`http://localhost:8000/api/v1/user/${userId}/profile`,{withCredentials:true})
                    if(res.data.success){
                        dispatch(setUserProfile(res.data.user))

                    }
               
            } catch (error) {
                console.log(error.response?.data || error.message)
            }
        }
        fetchUserProfile()
    },[userId,user])
}
export default useGetUserProfile
