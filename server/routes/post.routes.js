import express from "express";
import upload from "../middlewares/multer.js";
import { addComment, addNewPost, bookmarkPost, deletePost, dislikePost, getAllComments, getAllPosts, getUserPosts, likePost } from "../controllers/post.controller.js";

const router = express.Router()

router.route("/addpost").post(isAuthenticated,upload.single('image'),addNewPost)
router.route("/getpost").get(isAuthenticated,getAllPosts)
router.route("/userpost/all").get(isAuthenticated,getUserPosts)
router.route("/:id/like").get(isAuthenticated,likePost)
router.route("/:id/dislike").get(isAuthenticated,dislikePost)
router.route("/:id/comment").post(isAuthenticated,addComment)
router.route("/:id/comment/all").get(isAuthenticated,getAllComments)
router.route("/delete/:id").post(isAuthenticated,deletePost)
router.route("/bookmark/:id").post(isAuthenticated,bookmarkPost)

export default router;