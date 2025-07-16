import Nav from "./components/Navbar";
import { HomePage } from "./pages/Home";
import Footer from "./components/Footer";
import FrontEnd from "./pages/Frontend/FrontEnd";

import AboutSection from "./components/AboutSection";

import { CoursePage } from "./pages/Frontend/tutorial/CoursePage";
import AboutUsPage from "./pages/AboutUsPage";
import ContactUs from "./pages/ContactUs";
import SignUp from "./pages/SignUp";
import AdminPanel from "./pages/Admin/AdminPanel";
import Login from "./pages/Login/Login";
import SubscriptionPage from "./pages/SubscriptionPage";
import SubscriptionSuccess from "./pages/subscriptionSuccess";
import ProtectedRoute from "./pages/ProtectedRoute";
import { UserProvider } from './context/UserContext';
import { useEffect } from 'react';
import axios from 'axios';
import ChatPass from "./pages/ChatPass";
import MentorDashboard from './pages/MentorDashboard'
import Carousel from "./components/Carousel";

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

function Layout({ children }) {
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  );
}

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Layout>
          <HomePage />
        </Layout>
      ),
    },
    {
      path: "/categories/:category",
      element: (
        <Layout>
          <FrontEnd />
          <AboutSection />
        </Layout>
      ),
    },
    {
      path: "/:category/:courseName/topics",
      element: (
        <Layout>
          <CoursePage />
          <AboutSection />
        </Layout>
      ),
    },
    {
      path: "/aboutus",
      element: (
        <Layout>
          <AboutUsPage />
          <AboutSection />
        </Layout>
      ),
    },
    {
      path: "/contactus",
      element: (
        <Layout>
          <ContactUs />
          <AboutSection />
        </Layout>
      ),
    },
    {
      path: "/signup",
      element: (
        <Layout>
          <SignUp />
          <AboutSection />
        </Layout>
      ),
    },
    {
      path: "/login",
      element: (
        <Layout>
          <Login />
          <AboutSection />
        </Layout>
      ),
    },
    {
      path: "/admin",
      element: 
      <ProtectedRoute roles={['admin']}>
      <AdminPanel />  
      </ProtectedRoute>
    },
    {
      path: "/subscription",
      element: (
        <Layout>
          <SubscriptionPage />
          <AboutSection />
        </Layout>
      ),
    },
    {
      path: "/subscription/success",
      element: (
        <Layout>
          <SubscriptionSuccess />
        </Layout>
      ),
    },
    {
      path: "/chat",
      element: (
        <Layout>
          <ChatPass />
        </Layout>
      ),
    },
    {
      path: "/mentor-dashboard",
      element: (
        <ProtectedRoute roles={['mentor']}>
          <MentorDashboard />
        </ProtectedRoute>
      )
    },
    {
      path:"caro",
      element:(
        <Layout>
          <Carousel />
        </Layout>
      )
    }
    
  ]);

  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  return (
    <UserProvider>
        <div className="overflow-x-hidden bg-gray-50 text-white">
          <RouterProvider router={router} />
        </div>
      </UserProvider>
  );
}

export default App;