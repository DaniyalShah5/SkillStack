import express from 'express';

import { updateCourseDescription, getCourseDescription } from '../controllers/categoryController.js';

const router = express.Router();


router.put('/courses/:courseId/description', updateCourseDescription);
router.get('/courses/:courseId/description', getCourseDescription)

export default router;