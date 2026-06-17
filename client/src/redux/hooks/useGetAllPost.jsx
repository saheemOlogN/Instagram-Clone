import axios from "axios"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setPosts } from "../postSlice"

const useGetAllPost = () =>{
    const dispatch = useDispatch()
    const { user } = useSelector(store => store.auth)
    useEffect(()=>{
        if (!user) return
        const fetchAllPost = async ()=>{
            try {
                const res = await axios.get('/api/v1/post/all',{withCredentials:true})
                    if(res.data.success){
                        console.log(res.data)
                        dispatch(setPosts(res.data.posts))

                    }
               
            } catch (error) {
                console.log(error.response?.data || error.message)
            }
        }
        fetchAllPost()
    },[user])
}
export default useGetAllPost
