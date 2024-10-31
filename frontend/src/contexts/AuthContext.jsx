// import React, { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const AuthContext = createContext(undefined);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [doctor,setDoctor]=useState(null);
//   const [socket,setSocket]=useState(null)
//   const [senderId,setSenderId]=useState(null)
//   const [recieverId,setRecieverId]=useState(null)
//   const [specialist,setSpecialist]=useState(null)
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if(storedUser){
//       setUser(storedUser)
//     }
//     else{
//       setUser(null)
//     }
//     const storedDoctor = localStorage.getItem("doctor");
//     if(storedDoctor){
//       setDoctor(storedDoctor)
//     }
//     else{
//       setDoctor(null)
//     }
//   }, []);

//   const login = async (email, password) => {
//     try {
//       // Replace with your actual API endpoint
//       const response = await axios.post(
//         "http://localhost:5000/api/auth/login",
//         {
//           email,
//           password,
//         }
//       );
//       const userData = response.data.user;
//       setUser(userData);
//       localStorage.setItem("user", JSON.stringify(userData));
//     } catch (error) {
//       console.error("Login error:", error);
//       throw error;
//     }
//   };

//   const register = async (email, password, fullName) => {
//     try {
//       // Replace with your actual API endpoint
//       const response = await axios.post(
//         "http://localhost:5000/api/auth/register",
//         { email, password, fullName }
//       );
//       const userData = response.data.user;
//       setUser(userData);
//       localStorage.setItem("user", JSON.stringify(userData));
//     } catch (error) {
//       console.error("Registration error:", error);
//       throw error;
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("token")
//     setUser(null);
//     localStorage.removeItem("user");
    
//   };

//   const value = {
//     specialist,
//     setSpecialist,
//     socket,
//     setSocket,
//     senderId,
//     setSenderId,
//     recieverId,
//     setRecieverId,
//     doctor,
//     setDoctor,
//     user,
//     setUser,
//     login,
//     register,
//     logout,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import {socket,senderId} from "./Socket"
const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [senderId, setSenderId] = useState(null);
  const [recieverId, setRecieverId] = useState(null);
  const [specialist, setSpecialist] = useState(null);
  const [doctorId, setDoctorId] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser);

    const storedDoctor = localStorage.getItem("doctor");
    setDoctor(storedDoctor);

    // Emit necessary events after user or doctor login
    if (user) {
      socket.emit("user-name", { user });
    }
    if (user && specialist) {
      socket.emit("specialization", { specialization: specialist });
    }
    if (doctorId) {
      socket.emit("doctor-login", { id: doctorId });
    }
  }, [user, doctor, specialist, doctorId]);

  const login = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      const userData = response.data.user;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (email, password, fullName) => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        email,
        password,
        fullName,
      });
      const userData = response.data.user;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    socket.disconnect();
  };

  const value = {
    setDoctorId,
    specialist,
    setSpecialist,
    socket,
    senderId,
    recieverId,
    setRecieverId,
    doctor,
    setDoctor,
    user,
    setUser,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

