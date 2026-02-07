import express from 'express';
import {
  getPublicBlogs,
  getUserBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog
} from '../controllers/blogController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/public', getPublicBlogs);
router.route('/').get(protect, getUserBlogs).post(protect, createBlog);
router.route('/:id').get(getBlog).put(protect, updateBlog).delete(protect, deleteBlog);

export default router;

