import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import axios from "axios";

function Nav() {
  const { user, logout } = useUser();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [topicsDropdown, setTopicsDropdown] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);

  const userDropdownRef = useRef(null);
  const coursesDropdownRef = useRef(null);

  const handleChatPassClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.chatPassActive) {
      navigate("/chat");
    } else {
      navigate("/subscription");
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setShowUserDropdown(false);
      }

      
      if (
        coursesDropdownRef.current &&
        !coursesDropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/categories/get-courses-info"
      );
      setTopicsDropdown(response.data);
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };

  const getInitials = (name) => {
    if (!name) return "";
    return name.split(" ")[0][0].toUpperCase();
  };

  const handleLogout = () => {
    logout();
    setShowUserDropdown(false);
  };

  useEffect(() => {
    const verifySubscription = async () => {
      if (user?.id) {
        try {
          const { data } = await axios.get(
            `http://localhost:4000/api/subscription/status/${user.id}`
          );
          setSubscriptionStatus(data);

          if (data.chatPassActive !== user.chatPassActive) {
            updateUser({
              ...user,
              chatPassActive: data.chatPassActive,
              subscriptionEnd: data.subscriptionEnd,
              subscriptionPlan: data.subscriptionPlan,
            });
          }
        } catch (error) {
          console.error("Error verifying subscription:", error);
        }
      }
    };

    if (showUserDropdown) {
      verifySubscription();
    }
  }, [showUserDropdown, user?.id]);

  return (
    <>
      <nav className=" bg-violet-500 sticky top-0 py-5 z-20 text-white">
        <div className="flex justify-between items-center w-11/12 mx-auto">
          <Link to="/" className="text-2xl font-bold  font-serif">
            SkillStack
          </Link>

          <ul className="flex space-x-8 list-none">
            <li className="hover:scale-110 ease-in-out duration-200">
              <Link
                to="/"
                className={`hover:font-bold ease-in-out duration-200 ${
                  location.pathname === "/" ? "font-bold border-b-2 " : ""
                }`}
              >
                Home
              </Link>
            </li>
            <li
              className="relative hover:scale-110 ease-in-out duration-200"
              ref={coursesDropdownRef}
            >
              <button
                className={`hover:font-bold ease-in-out duration-200 ${
                  location.pathname.includes("categories")
                    ? "font-bold border-b-2 "
                    : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDropdown(!showDropdown);
                }}
              >
                Courses
              </button>
              {showDropdown && (
                <ul className="absolute bg-white py-2 rounded-lg shadow-lg w-40 mt-2">
                  {topicsDropdown.map((item) => (
                    <li key={item._id}>
                      <Link
                        to={`/categories/${item.categoryName}`}
                        className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                        onClick={() => setShowDropdown(false)}
                      >
                        {item.categoryName}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li className="hover:scale-110 ease-in-out duration-200">
              <button
                className={`hover:font-bold ease-in-out duration-200   ${
                  location.pathname === "/subscription"
                    ? " font-bold border-b-2 "
                    : ""
                }`}
                onClick={handleChatPassClick}
              >
                ChatPass
              </button>
            </li>
            <li className="hover:scale-110 ease-in-out duration-200">
              <Link
                to="/aboutus"
                className={`hover:font-bold ease-in-out duration-200 ${
                  location.pathname === "/aboutus"
                    ? "font-bold border-b-2 "
                    : ""
                }`}
              >
                About
              </Link>
            </li>
            <li className="hover:scale-110 ease-in-out duration-200">
              <Link
                to="/contactus"
                className={`hover:font-bold ease-in-out duration-200  ${
                  location.pathname === "/contactus"
                    ? "font-bold border-b-2 "
                    : ""
                }`}
              >
                Contact
              </Link>
            </li>
          </ul>

          <div ref={userDropdownRef}>
            {user ? (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUserDropdown(!showUserDropdown);
                  }}
                  className="w-12 h-12 rounded-full bg-violet-400 flex items-center justify-center text-white hover:bg-violet-500 transition-colors"
                >
                  {getInitials(user.name)}
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm border-b text-gray-700">
                        Signed in as
                        <br />
                        <span className="font-medium">{user.name}</span>
                      </div>
                      {user.role==='user'?(
                        <div className="px-4 py-2 text-sm border-b">
                        {user.chatPassActive ? (
                          <>
                            <p className="font-semibold text-green-600">
                              ChatPass Active
                            </p>
                            <p className="text-gray-700">
                              {user.subscriptionPlan}
                            </p>
                            <p className="text-gray-500">
                              Expires:{" "}
                              {new Date(
                                user.subscriptionEnd
                              ).toLocaleDateString()}
                            </p>
                          </>
                        ) : (
                          <p className="font-semibold text-red-500">
                            ChatPass Inactive
                          </p>
                        )}
                      </div>
                      ):(<></>)}
                      
                      
                      {user.role==='mentor'?(
                        <div className="px-4 py-2 text-sm border-b">
                      <Link to='/mentor-dashboard'>
                      <p className="text-black">Mentor Chatbox</p>
                      </Link>
                      </div>):(<>
                      
                      </>)}
                      {user.role==='admin'?(
                        <div className="px-4 py-2 text-sm border-b">
                        <Link to='/admin'>
                        <p className="text-black">Admin Dashboard</p>
                        </Link>
                        </div>
                      ):(<></>)}
                      
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-4">
                <Link
                  to="/login"
                  className=" p-2 px-3 border-white border  hover:bg-violet-400 hover:scale-110 font-bold ease-in-out duration-200 tracking-wide"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-black bg-opacity-90 p-2 px-2  hover:bg-opacity-70 hover:scale-110 font-bold ease-in-out duration-200 tracking-wide"
                >
                  SignUp
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Nav;
