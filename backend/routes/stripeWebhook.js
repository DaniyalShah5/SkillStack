import express from 'express';
import { handleWebhook } from '../controllers/subscriptionController.js';

const router = express.Router();


router.post('/', handleWebhook);




export default router;