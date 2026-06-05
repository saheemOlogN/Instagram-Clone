import React from 'react'
import { Dialog, DialogContent } from './ui/dialog'

const CommentDialog = ({open,setOpen}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}> 
        <DialogContent onInteractOutside={()=> setOpen(false)}>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcAOZ0UcyYsrRhxUkZk6nG66WTLg-NhiTEcg&s"  alt="" />
        </DialogContent>
    </Dialog>
  )
}

export default CommentDialog