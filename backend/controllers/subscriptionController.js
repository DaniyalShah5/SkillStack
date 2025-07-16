import User from '../models/User.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
  try {
    console.log('hello')
    const { plan, userId } = req.body;
    console.log('Creating payment intent:', { plan, userId });

    if (!plan || !userId) {
      return res.status(400).json({ error: 'Plan and userId are required' });
    }

    const planDetails = getPlanDetails(plan);
    if (!planDetails) {
      return res.status(400).json({ error: 'Invalid plan selected' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: planDetails.amount,
      currency: 'usd',
      metadata: {
        plan,
        userId
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log('Created payment intent:', paymentIntent.id);

    res.json({
      clientSecret: paymentIntent.client_secret,
      amount: planDetails.amount,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
};


export const subscribe = async (req, res) => {
  try {
    console.log(userId)
    const { userId, plan } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const planDetails = getPlanDetails(plan);
    if (!planDetails) {
      return res.status(400).json({ error: 'Invalid plan selected' });
    }

    
    const subscriptionEnd = calculateSubscriptionEnd(plan);
    
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        chatPassActive: true,
        subscriptionEnd: subscriptionEnd,
        subscriptionPlan: plan
      },
      { new: true }
    );

    console.log('Updated user:', updatedUser);

    res.status(200).json({
      success: true,
      subscriptionEnd: subscriptionEnd,
      plan : plan
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const cancelSubscription = async (req, res) => {
  try {
    const { userId } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    
    await User.findByIdAndUpdate(userId, {
      chatPassActive: false,
      subscriptionEnd: null,
      subscriptionPlan: null
    });

    res.status(200).json({
      success: true,
      message: 'Subscription cancelled successfully'
    });
  } catch (error) {
    console.error('Cancellation error:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
};


export const getSubscriptionStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      chatPassActive: user.chatPassActive,
      subscriptionEnd: user.subscriptionEnd,
      subscriptionPlan: user.subscriptionPlan,
      name: user.name,
      email: user.email,
      id: user._id
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subscription status' });
  }
};


export const handleWebhook = async (req, res) => {
  try {
    console.log('1. Webhook received:', new Date().toISOString());
    console.log('2. Request headers:', req.headers);

    const sig = req.headers['stripe-signature'];
    let event;

    try {
      console.log('req body ::' ,req.body)
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      console.log('3. Event constructed successfully:', event.type);
    } catch (err) {
      console.error('4. Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('5. Payment Intent Succeeded:', paymentIntent.id);
        console.log('6. Payment Intent Metadata:', paymentIntent.metadata);

        const { plan, userId } = paymentIntent.metadata;
        
        if (!plan || !userId) {
          console.error('7. Missing metadata - Plan:', plan, 'UserId:', userId);
          return res.status(400).json({ error: 'Missing required metadata' });
        }

        
        const subscriptionEnd = calculateSubscriptionEnd(plan);
        console.log('8. Calculated subscription end:', subscriptionEnd);

        try {
          
          const user = await User.findById(userId);
          if (!user) {
            console.error('9. User not found:', userId);
            return res.status(404).json({ error: 'User not found' });
          }
          console.log('10. Found user:', user.email);

          
          const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
              chatPassActive: true,
              subscriptionEnd: subscriptionEnd,
              subscriptionPlan: plan
            },
            { new: true }
          );

          console.log('11. Updated user:', updatedUser);

          if (!updatedUser) {
            console.error('12. Update failed - no user returned');
            return res.status(500).json({ error: 'Failed to update user' });
          }

          console.log('13. Successfully updated user subscription');
        } catch (error) {
          console.error('14. Database operation failed:', error);
          return res.status(500).json({ error: 'Database operation failed' });
        }
        break;

      default:
        console.log(`15. Unhandled event type ${event.type}`);
    }

    console.log('16. Sending success response');
    res.json({ received: true });
  } catch (error) {
    console.error('17. Unexpected error:', error);
    res.status(500).json({ error: 'Unexpected error occurred' });
  }
};


function getPlanDetails(plan) {
  const plans = {
    'Weekly Pass': {
      duration: 7,
      amount: 999 
    },
    'Monthly Pass': {
      duration: 30,
      amount: 2999 
    },
    'Yearly Pass': {
      duration: 365,
      amount: 19999 
    }
  };
  return plans[plan];
}

function calculateSubscriptionEnd(plan) {
  const now = new Date();
  const subscriptionEnd = new Date(now);
  
  switch(plan) {
    case 'Weekly Pass':
      subscriptionEnd.setDate(now.getDate() + 7);
      break;
    case 'Monthly Pass':
      subscriptionEnd.setMonth(now.getMonth() + 1);
      break;
    case 'Yearly Pass':
      subscriptionEnd.setFullYear(now.getFullYear() + 1);
      break;
  }
  
  return subscriptionEnd;
}

export const testUpdateSubscription = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const updateResult = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          chatPassActive: true,
          subscriptionEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
          subscriptionPlan: 'Weekly Pass'
        }
      },
      { new: true }
    );

    console.log('Test update result:', updateResult);

    res.json(updateResult);
  } catch (error) {
    console.error('Test update error:', error);
    res.status(500).json({ error: error.message });
  }
};