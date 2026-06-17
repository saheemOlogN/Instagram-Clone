import express from "express"
import { editProfile, followOrUnfollow, getFollowingUsers, getProfile, getSuggestedUser, login, logout, register, searchUser } from "../controllers/user.controller.js"
import isAuthenticated from "../middlewares/isAuthenticated.js"
import upload from "../middlewares/multer.js"

const router = express.Router()

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/search').get(isAuthenticated,searchUser)
router.route('/following').get(isAuthenticated,getFollowingUsers)
router.route('/:id/profile').get(isAuthenticated,getProfile)
router.route('/profile/edit').post(isAuthenticated,upload.single('profilePicture'),editProfile)
router.route('/suggested').get(isAuthenticated,getSuggestedUser)
router.route('/followunfollow/:id').post(isAuthenticated,followOrUnfollow)

export default router;
