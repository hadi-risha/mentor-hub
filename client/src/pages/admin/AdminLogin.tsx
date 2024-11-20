import React, { useState } from "react";
import axiosInstance from "../../utils/admin/axiosInstance"; // Import the axios instance with interceptors
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/admin/login', { email, password });
      const { token } = response.data;
      localStorage.setItem('adminToken', token); // Save token to localStorage
      console.log("admin login success");
      console.log("admin token", token);
      
      
      navigate('/admin/dashboard'); // Navigate to admin dashboard upon successful login
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="-mt-16 relative flex flex-col justify-center min-h-screen overflow-hidden">
        <div className="w-full p-10 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
            <h1 className="text-3xl font-semibold text-center text-black underline">
                Admin Log In
            </h1>
            
            <form className="mt-6" onSubmit={handleLogin}>
                <div className="mb-2">
                    <label className="block text-sm font-semibold text-gray-600">Email</label>
                    <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-sm font-semibold text-gray-600">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    />  
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                
                <div className="mt-6">
                    <button className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600">
                        Login
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default AdminLogin;


























