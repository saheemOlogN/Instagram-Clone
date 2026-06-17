import axios from "axios"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setPosts } from "../postSlice"
import { setSuggestedUsers } from "../authSlice"

const useSuggestedUsers = () =>{
    const dispatch = useDispatch()
    const { user } = useSelector(store => store.auth)
    useEffect(()=>{
        if (!user) return
        const fetchSuggestedUsers = async ()=>{
            try {
                const res = await axios.get('/api/v1/user/suggested',{withCredentials:true})
                    if(res.data.success){
                        dispatch(setSuggestedUsers(res.data.users))

                    }
               
            } catch (error) {
                console.log(error.response?.data || error.message)
            }
        }
        fetchSuggestedUsers()
    },[user])
}
export default useSuggestedUsers
