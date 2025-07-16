import express from 'express';
import { deleteTopic,deleteCourse,deleteCategory } from '../controllers/deleteController.js';

const router = express.Router();

router.delete('/topics/:topicId',deleteTopic);
router.delete('/courses.:courseId',deleteCourse);
router.delete('/categories/:categoryId',deleteCategory);

export default router;