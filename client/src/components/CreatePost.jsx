import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { useRef, useState } from 'react'
import { readFile } from '../lib/utils.js'
import { Loader2 } from 'lucide-react'
import axios from "axios";
import { toast } from "sonner"; 
import {useDispatch, useSelector} from 'react-redux'
import { setPosts } from '../redux/postSlice.js'



const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef()
  const [file, setFile] = useState("")
  const [caption, setCaption] = useState("")
  const [imagePreview, setImagePreview] = useState("")
  const [loading, setLoading] = useState(false)
  const { posts } = useSelector(store => store.post)
  const { user } = useSelector(store => store.auth)
  const dispatch = useDispatch()

  const createPostHandler = async (e) => {
    const formData = new FormData()
    formData.append("caption", caption)
    if (imagePreview) formData.append("image", file)

    try {
          e.preventDefault();
      setLoading(true)
      const res = await axios.post("http://localhost:8000/api/v1/post/addpost",formData,{
        headers:{
          'Content-Type':'multipart/form-data'
        },
        withCredentials:true
      })

      if(res.data.success){
        dispatch(setPosts([res.data.post,...posts]))
        toast.success(res.data.message)
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
    finally{
      setLoading(false)
    }
  }

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setFile(file)
      const dataUri = await readFile(file)
      setImagePreview(dataUri)
    }
    if (!file) return
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogHeader>
          <DialogTitle className='text-center font-semibold'>Create New Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={createPostHandler}>
          <div className='flex gap-3 items-center'>
            <Avatar>
              <AvatarImage src={user?.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h1 className='font-semibold text-xs'>{user?.username}</h1>
              <span className='text-gray-600 text-xs'>bio here...</span>
            </div>
          </div>
          <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} className="focus-visible:ring-transparent border-none" placeholder="Write a caption...." />
          {
            imagePreview && (
              <div className='w-full h-64 flex items-center justify-center'>
                <img src={imagePreview} className='object-cover h-full w-full rounded-md' alt="" />
              </div>
            )
          }
          <input ref={imageRef} type="file" onChange={fileChangeHandler} className='hidden' />
          <div className='flex justify-center flex-col gap-2'>
            <Button type="button" onClick={() => imageRef.current.click()} className='w-fit mx-auto bg-[#0095F6] hover:bg-[#0f7dc5]'>
              Select From your device
            </Button>
            {
              imagePreview && (
                loading ? (
                  <Button>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Please Wait
                  </Button>

                ) : (
                  <Button onClick={createPostHandler} type="submit" className="w-full">
                    Post
                  </Button>

                )

              )
            }

          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreatePost
