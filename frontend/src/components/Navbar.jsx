import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const navigate=useNavigate()
  const { user, logout,doctor,setDoctor } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleLogout=()=>{
    logout()
    navigate("/")
  }
  const handleDoctorLogout=()=>{
    setDoctor(null)
    localStorage.removeItem("doctor")
    localStorage.removeItem("token")
    navigate("/DocLogin")
  }
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-[#5CF7F8] shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div>
              <Link to="/" className="flex items-center py-4 px-2">
                <Heart className="h-8 w-8 mr-2 text-black" />
                <span className="font-semibold text-black text-lg">
                  HealthCare App
                </span>
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-3">
  {user ? (
    // If the patient (user) is logged in
    <>
      <Link
        to="/home"
        className="py-2 px-2 font-medium text-black rounded hover:bg-blue-400 transition duration-300"
      >
        Home
      </Link>
      <Link
        to="/health-bot"
        className="py-4 px-2 text-black hover:bg-blue-400 transition duration-300"
      >
        Health Bot
      </Link>
      <button
        onClick={handleLogout}
        className="py-2 px-2 font-medium text-black rounded hover:bg-blue-400 transition duration-300 flex items-center"
      >
        <LogOut className="h-5 w-5 mr-1" />
        Logout
      </button>
    </>
  ) : doctor ? (
    // If the doctor is logged in
    <>
      <button
        onClick={handleDoctorLogout}
        className="py-2 px-2 font-medium text-black rounded hover:bg-blue-400 transition duration-300 flex items-center"
      >
        <LogOut className="h-5 w-5 mr-1" />
        Logout
      </button>
    </>
  ) : (
    // If neither user nor doctor is logged in, show Login and Register options
    <>
      <Link
        to="/"
        className="py-2 px-2 font-medium text-black rounded hover:bg-blue-400 transition duration-300"
      >
        Login
      </Link>
      <Link
        to="/register"
        className="py-2 px-2 font-medium text-black rounded hover:bg-blue-400 transition duration-300"
      >
        Register
      </Link>
    </>
  )}
</div>

          <div className="md:hidden flex items-center">
            <button
              className="outline-none mobile-menu-button"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-white hover:text-gray-200" />
              ) : (
                <Menu className="w-6 h-6 text-white hover:text-gray-200" />
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <ul className="bg-blue-500 border-t border-blue-400">
          <li>
            <Link
              to="/"
              className="block text-sm px-2 py-4 text-white hover:bg-blue-400 transition duration-300"
            >
              Home
            </Link>
          </li>
          {user ? (
            <>
              <li>
                <Link
                  to="/health-bot"
                  className="block text-sm px-2 py-4 text-white hover:bg-blue-400 transition duration-300"
                >
                  Health Bot
                </Link>
              </li>
              <li>
                <button
                  onClick={logout}
                  className="block text-sm px-2 py-4 text-white hover:bg-blue-400 transition duration-300 w-full text-left"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  className="block text-sm px-2 py-4 text-white hover:bg-blue-400 transition duration-300"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="block text-sm px-2 py-4 text-white hover:bg-blue-400 transition duration-300"
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
