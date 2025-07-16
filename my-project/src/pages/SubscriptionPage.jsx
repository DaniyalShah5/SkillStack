import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import axios from 'axios';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ plan, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      console.log('Stripe or elements not loaded');
      return;
    }

    setLoading(true);
    try {
      console.log('Submitting payment for plan:', plan);

      const { error: submitError } = await elements.submit();
      if (submitError) {
        console.error('Submit error:', submitError);
        onError(submitError.message);
        return;
      }

      console.log('Creating payment intent...');
      const { data: intentData } = await axios.post('http://localhost:4000/api/stripe/create-payment-intent', {
        plan,
        userId: user.id
      });
      console.log('Payment intent created:', intentData);

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret: intentData.clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/subscription/success`,
          payment_method_data: {
            billing_details: {
              email: user.email
            }
          }
        },
      });

      if (confirmError) {
        console.error('Confirmation error:', confirmError);
        onError(confirmError.message);
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      onError(error.response?.data?.error || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      
      <button 
        type="submit" 
        disabled={!stripe || loading}
        className="w-full py-2 px-4 bg-violet-600 text-white rounded-md hover:bg-violet-700 disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Subscribe'}
      </button>
    </form>
  );
};

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useUser();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const subscriptionPlans = [
    {
      title: "Weekly Pass",
      price: "$9.99",
      duration: "7 days",
      features: [
        "Unlimited chat with mentors",
        "24/7 support",
        "Code review assistance",
        "Quick response time"
      ]
    },
    {
      title: "Monthly Pass",
      price: "$29.99",
      duration: "30 days",
      features: [
        "All weekly features",
        "Priority support",
        "Personal mentor assignment",
        "Project guidance"
      ],
      popular: true
    },
    {
      title: "Yearly Pass",
      price: "$199.99",
      duration: "365 days",
      features: [
        "All monthly features",
        "Dedicated mentor",
        "Career guidance",
        "Resume review",
        "40% savings compared to monthly"
      ]
    }
  ];

  const handlePlanSelection = (plan) => {
    console.log('Plan selected:', plan);
    setSelectedPlan(plan);
  };

  const handleCancelCheckout = () => {
    setSelectedPlan(null);
    setClientSecret(null);
  };

  const handleSubscriptionSuccess = async () => {
    setSuccess(true);
    try {
      const { data } = await axios.get(`http://localhost:4000/api/subscription/status/${user.id}`);
      const updatedUserData ={
        ...user,
        chatPassActive: data.chatPassActive,
        subscriptionEnd: data.subscriptionEnd,
        subscriptionPlan: data.subscriptionPlan
      };
      updateUser(updatedUserData);
      
      localStorage.setItem('user', JSON.stringify(updatedUserData));

      setTimeout(() => navigate('/chat'), 2000);
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleSubscriptionError = (errorMessage) => {
    console.error('Subscription error:', errorMessage);
    setError(errorMessage);
    setTimeout(() => setError(null), 5000);
  };

  useEffect(() => {
    if (selectedPlan) {
      const initializePayment = async () => {
        try {
          console.log('Initializing payment for plan:', selectedPlan);
          const { data } = await axios.post('http://localhost:4000/api/stripe/create-payment-intent', {
            plan: selectedPlan,
            userId:user.id
          });
          console.log('Payment intent response:', data);
          setClientSecret(data.clientSecret);
        } catch (error) {
          console.error('Payment initialization error:', error);
          setError(error.response?.data?.error || 'Failed to initialize payment');
        }
      };
      initializePayment();
    }
  }, [selectedPlan]);

  
  if (user?.chatPassActive) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Active Subscription</h2>
            <p className="text-lg text-gray-600">
              Your ChatPass subscription is active until {new Date(user.subscriptionEnd).toLocaleDateString()}
            </p>
            <button
              onClick={() => navigate('/chat')}
              className="mt-4 px-6 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700"
            >
              Go to Chat
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            ChatPass Subscription Plans
          </h2>
          <p className="text-xl text-gray-600">
            Get personalized support from professional developers
          </p>
        </div>

        {error && (
          <div className="max-w-md mx-auto mb-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        {success && (
          <div className="max-w-md mx-auto mb-8 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            Subscription successful! Redirecting to chat...
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {subscriptionPlans.map((plan) => (
            <div 
              key={plan.title} 
              className={`relative rounded-lg shadow-lg bg-white p-8 ${
                plan.popular ? 'ring-2 ring-violet-500' : ''
              } ${selectedPlan === plan.title ? 'ring-2 ring-blue-500' : ''}`}
            >
              {plan.popular && (
                <span className="absolute top-0 right-6 -translate-y-4 bg-violet-500 text-white px-3 py-1 text-sm font-semibold rounded-full">
                  Most Popular
                </span>
              )}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{plan.title}</h3>
                <p className="text-4xl font-bold text-gray-900 mb-1">{plan.price}</p>
                <p className="text-gray-600 mb-6">per {plan.duration}</p>

                <ul className="text-left space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanSelection(plan.title)}
                  className={`w-full py-3 px-6 rounded-lg font-semibold ${
                    plan.popular
                      ? 'bg-violet-600 text-white hover:bg-violet-700'
                      : 'bg-gray-800 text-white hover:bg-gray-900'
                  } transition-colors duration-200`}
                >
                  Select Plan
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedPlan && clientSecret && (
          <div className="absolute inset-0 bg-gray-50 bg-opacity-80">
          <div className="relative max-w-md mx-auto mt-36 bg-white p-8 rounded-lg shadow-2xl shadow-black">
            
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Complete Subscription
            </h3>
            <button 
      type="button" 
      onClick={handleCancelCheckout}
      className="absolute right-4 top-4 px-2 bg-gray-200 text-gray-500 font-bold rounded-full hover:bg-gray-300"
    >
      X
    </button>
            
            <Elements 
              stripe={stripePromise} 
              options={{
                clientSecret,
                appearance: {
                  theme: 'stripe',
                  variables: {
                    colorPrimary: '#8b5cf6',
                    colorBackground: '#ffffff',
                    colorText: '#1f2937'
                  }
                }
              }}
            >
              <CheckoutForm
                plan={selectedPlan}
                onSuccess={handleSubscriptionSuccess}
                onError={handleSubscriptionError}
                onCancel={handleCancelCheckout}
              />
            </Elements>
          </div>
          </div>
        )}

        <div className="mt-12 text-center text-gray-600">
          <p>
            Questions about ChatPass? {' '}
            <button 
              onClick={() => navigate('/contact')}
              className="text-violet-600 hover:text-violet-700 underline"
            >
              Contact our support team
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;