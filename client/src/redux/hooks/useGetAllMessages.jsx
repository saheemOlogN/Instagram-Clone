import axios from "axios"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setMessages } from "../chatSlice"

const useGetAllMessages = () =>{
    const dispatch = useDispatch()
    const { selectedUser } = useSelector(store => store.auth)

    useEffect(()=>{
        if (!selectedUser?._id) {
            dispatch(setMessages([]))
            return
        }

       
        const fetchAllMessages = async ()=>{
            try {
                const res = await axios.get(`http://localhost:8000/api/v1/message/all/${selectedUser?._id}`,{withCredentials:true})
                    if(res.data.success){
                        dispatch(setMessages(res.data.messages))

                    }
               
            } catch (error) {
                console.log(error.response?.data || error.message)
            }
        }
        fetchAllMessages()
    },[selectedUser?._id, dispatch])
}
export default useGetAllMessages
