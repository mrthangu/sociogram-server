import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controller/posts.js";
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();

//Read
router.get('/', verifyToken, getFeedPosts)
router.get('/:userId/posts', verifyToken, getUserPosts)

//Uppdate
router.patch('/:id/like', likePost)

export default router;;
