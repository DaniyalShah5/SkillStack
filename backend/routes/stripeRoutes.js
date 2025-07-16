import express from 'express';
import { createPaymentIntent } from '../controllers/subscriptionController.js';

const router = express.Router();


router.post('/create-payment-intent', createPaymentIntent);


export default router;