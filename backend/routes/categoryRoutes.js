import express from 'express';
import { createOrUpdate, getAll } from '../controllers/categoryController.js';

const router = express.Router();

router.post('/create-or-update', createOrUpdate);
router.get('/get-courses-info', getAll);


export default router;
