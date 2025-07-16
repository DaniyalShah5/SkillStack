import express from 'express';
import { 
    createPaymentIntent,
    subscribe, 
    cancelSubscription, 
    getSubscriptionStatus
} from '../controllers/subscriptionController.js';

const router = express.Router();


router.post('/create-payment-intent', createPaymentIntent);


router.post('/subscribe', subscribe);


router.post('/cancel', cancelSubscription);


router.get('/status/:userId', getSubscriptionStatus);




export default router;