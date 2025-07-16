import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';


const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (storedUser && token) {
        try {
          const userData = JSON.parse(storedUser);
          
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          
          try {
            const { data } = await axios.get(`http://localhost:4000/api/subscription/status/${userData.id}`);
            
            const updatedUserData = {
              ...userData,
              chatPassActive: data.chatPassActive,
              subscriptionEnd: data.subscriptionEnd,
              subscriptionPlan: data.subscriptionPlan
            };
            localStorage.setItem('user', JSON.stringify(updatedUserData));
            setUser(updatedUserData);
          } catch (error) {
            console.error('Error verifying subscription:', error);
            setUser(userData);
          }
        } catch (error) {
          console.error('Error parsing stored user:', error);
          
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  
  useEffect(() => {
    let interval;
    if (user?.id) {
      interval = setInterval(async () => {
        try {
          const { data } = await axios.get(`http://localhost:4000/api/subscription/status/${user.id}`);
          if (data.chatPassActive !== user.chatPassActive || 
              data.subscriptionEnd !== user.subscriptionEnd ||
              data.subscriptionPlan !== user.subscriptionPlan) {
            const updatedUser = {
              ...user,
              chatPassActive: data.chatPassActive,
              subscriptionEnd: data.subscriptionEnd,
              subscriptionPlan: data.subscriptionPlan
            };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }
        } catch (error) {
          console.error('Error verifying subscription status:', error);
        }
      }, 60000); 
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [user?.id]);

  
  const login = async (userData) => {
    try {
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      
      if (userData.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
        
        
        const { data } = await axios.get(`http://localhost:4000/api/subscription/status/${userData.id}`);
        
        
        const updatedUserData = {
          ...userData,
          chatPassActive: data.chatPassActive,
          subscriptionEnd: data.subscriptionEnd,
          subscriptionPlan: data.subscriptionPlan
        };
        
        setUser(updatedUserData);
        localStorage.setItem('user', JSON.stringify(updatedUserData));
      }
      
    } catch (error) {
      console.error('Error setting up user:', error);
    }
  };

  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    delete axios.defaults.headers.common['Authorization'];
  };

  
  const updateUser = async (newUserData) => {
    try {
      
      const updatedUser = { ...user, ...newUserData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      
      if ('chatPassActive' in newUserData || 'subscriptionEnd' in newUserData || 'subscriptionPlan' in newUserData) {
        const { data } = await axios.get(`http://localhost:4000/api/subscription/status/${updatedUser.id}`);
        
        
        const verifiedUser = {
          ...updatedUser,
          chatPassActive: data.chatPassActive,
          subscriptionEnd: data.subscriptionEnd,
          subscriptionPlan: data.subscriptionPlan
        };
        
        setUser(verifiedUser);
        localStorage.setItem('user', JSON.stringify(verifiedUser));
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  
  const checkSubscriptionStatus = async () => {
    if (!user?.id) return null;
    
    try {
      const { data } = await axios.get(`http://localhost:4000/api/subscription/status/${user.id}`);
      const updatedUser = {
        ...user,
        chatPassActive: data.chatPassActive,
        subscriptionEnd: data.subscriptionEnd,
        subscriptionPlan: data.subscriptionPlan
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return data;
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return null;
    }
  };

  
  const hasChatPass = () => {
    return user?.chatPassActive || false;
  };
  
  const hasRole = (role) => {
    return user?.role === role;
  };

  
  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    hasChatPass,
    hasRole,
    isAuthenticated: !!user,
    checkSubscriptionStatus
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}


export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};


export const withAuth = (WrappedComponent) => {
  return function WithAuthComponent(props) {
    const { user, loading } = useUser();

    if (loading) {
      return <div>Loading...</div>; 
    }

    if (!user ||  (allowedRoles && !allowedRoles.includes(user.role))) {
      return <Navigate to="/login" />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default UserContext;