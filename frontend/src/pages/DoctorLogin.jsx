import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const schema = yup.object().shape({
  doctorId: yup.string().required("Doctor ID is required"),
  password: yup.string().required("Password is required"),
});

const DoctorLogin = () => {
  const {socket,setDoctorId}=useAuth()
  const navigate = useNavigate();
  const { user, setUser,doctor,setDoctor } = useAuth();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/doctor/login", // Backend API endpoint
        {
          docId: data.doctorId,
          password: data.password,
        }
      );

      // Assuming the response contains a token or user data:
      navigate("/health-bot")
      const { token, user } = response.data;
      localStorage.setItem("doctor",user);
      setDoctor(user)
      localStorage.setItem("token", token);
      if(localStorage.getItem("user")){
        localStorage.removeItem("user")
      }
      setDoctorId(data.doctorId)
      // Navigate to the doctor's home page after successful login
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid Doctor ID or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center">
        <img
          src="src/assets/images/login.png"
          alt="Healthcare"
          width="300"
          height="300"
        />
      </div>
      <div className="max-w-md mx-auto bg-gray-300 rounded-[40px] shadow-md overflow-hidden">
        <div className="px-6 py-8">
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-8">
            Doctor Login
          </h2>
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label
                htmlFor="doctorId"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Doctor ID
              </label>
              <input
                type="text"
                id="doctorId"
                {...register("doctorId")}
                className="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              {errors.doctorId && (
                <p className="text-red-500 text-xs italic">
                  {errors.doctorId.message}
                </p>
              )}
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                {...register("password")}
                className="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              />
              {errors.password && (
                <p className="text-red-500 text-xs italic">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="flex items-center justify-center">
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline w-[100px] rounded-xl h-[40px]"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </button>
              </div>
            </div>
            <div className="text-center">
              <Link
                to="/forgot-password"
                className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="px-6 py-4">
              <p className="text-center text-gray-600 text-sm">
                Don't have an account?{" "}
                <Link
                  to="/DocRegister"
                  className="font-bold text-blue-500 hover:text-blue-800"
                >
                  Register as Doctor
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;
