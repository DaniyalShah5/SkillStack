import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import axios from 'axios';

const SubscriptionSuccess = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useUser();
  const [countdown, setCountdown] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    let timer;
    let countdownTimer;

    const updateSubscriptionStatus = async () => {
      if (!user?.id) {
        console.log('User not loaded yet');
        return;
      }

      try {
        setLoading(true);
        console.log('Updating subscription status for user:', user.id);
        
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const { data } = await axios.get(`http://localhost:4000/api/subscription/status/${user.id}`);
        console.log('Subscription status response:', data);

        if (data) {
          await updateUser({
            ...user,
            chatPassActive: data.chatPassActive,
            subscriptionEnd: data.subscriptionEnd,
            subscriptionPlan: data.subscriptionPlan
          });
        }

        
        countdownTimer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(countdownTimer);
              timer = setTimeout(() => {
                navigate('/chat');
              }, 1000);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

      } catch (error) {
        console.error('Error updating subscription status:', error);
        setError('Failed to update subscription status');
      } finally {
        setLoading(false);
      }
    };

    updateSubscriptionStatus();

    
    return () => {
      if (countdownTimer) clearInterval(countdownTimer);
      if (timer) clearTimeout(timer);
    };
  }, [user?.id, updateUser, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Your Subscription</h2>
            <p className="text-gray-600">Please wait while we verify your payment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => navigate('/chat')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-violet-600 hover:bg-violet-700"
            >
              Continue to Chat
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">
            Thank you for subscribing to ChatPass. Your account has been successfully upgraded.
          </p>
          <p className="text-gray-500 mb-4">
            Redirecting to chat in {countdown} seconds...
          </p>
          <button
            onClick={() => navigate('/chat')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-violet-600 hover:bg-violet-700"
          >
            Go to Chat Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;