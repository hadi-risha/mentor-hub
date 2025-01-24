import React, { useState } from "react";
import axiosInstance from "../../utils/admin/axiosInstance"; // Import the axios instance with interceptors
import { Link, useNavigate } from "react-router-dom";

const NewAdminLogin = () => {
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
    <div className="h-screen bg-[#848687] flex items-center justify-center"> 
        <div className="w-7/12 h-auto bg-[#1b2a49] flex signup-container">

            {/* Left side */}
            <div className="w-1/2 h-auto bg-[#5eb7b7] flex items-center justify-center flex-col">
                {/* <h1 className="text-3xl font-bold text-white">Welcome!</h1> */}
                <p className="text-white w-80 text-center mt-4">Login to your admin account and manage the platform effectively!</p>
                <svg xmlns="http://www.w3.org/2000/svg" width={110} height={110} viewBox="0 0 24 24"><path fill="#fefefe" d="M5.463 3.476C6.69 5.225 7.497 7.399 7.68 9.798a12.9 12.9 0 0 1-.672 5.254a4.3 4.3 0 0 1 2.969-1.523l.148-.008c.08-.491.47-3.45-.977-6.68c-1.068-2.386-3-3.16-3.685-3.365m1.777.037s2.406 1.066 3.326 5.547c.607 2.955.049 4.836-.402 5.773a7.35 7.35 0 0 1 4.506-1.994c.86-.065 1.695.02 2.482.233c-.1-.741-.593-3.414-2.732-5.92c-3.263-3.823-7.18-3.64-7.18-3.64Zm14.817 9.701l-17.92 3.049a2.28 2.28 0 0 1 1.535 2.254a2.3 2.3 0 0 1-.106.61c.055-.027 2.689-1.275 6.342-2.034c3.238-.673 5.723-.36 6.285-.273a6.46 6.46 0 0 1 3.864-3.606m-6.213 4.078c-2.318 0-4.641.495-6.614 1.166c-2.868.976-2.951 1.348-5.55 1.043C1.844 19.286 0 18.386 0 18.386s2.406 1.97 4.914 2.127c1.986.125 3.505-.822 5.315-1.414c2.661-.871 4.511-.97 6.253-.975C19.361 18.116 24 19.353 24 19.353s-2.11-1.044-5.033-1.72a14 14 0 0 0-3.123-.34Z"></path></svg>
            </div>


            {/* Right side */}
            <div className="w-1/2 h-full pt-20 pb-20 px-14">

                {/* Title Section */}
                <h1 className="text-2xl text-left text-[rgba(255, 255, 255, 0.8)] font-sans ">Admin Login</h1>

                {/* Form Section */}
                <form className="flex flex-col items-center mt-12 w-full">

                   
                    {/* Email Section */}
                    <label htmlFor="email" className="mt-6 w-full text-left text-[rgba(255, 255, 255, 0.8)] text-xs">EMAIL</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="johndoe@gmail.com"
                        className="w-full  text-sm bg-[#1b2a49] text-white focus:outline-none placeholder-gray-500 placeholder:text-xs"
                    />
                    <hr className="border-gray-600 my-1 w-full" />

                    {/* Password Section */}
                    <label htmlFor="password" className="mt-6 w-full text-left text-[rgba(255, 255, 255, 0.8)] text-xs">PASSWORD</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Password"
                        className="w-full text-sm bg-[#1b2a49] text-white focus:outline-none placeholder-gray-500 placeholder:text-xs"
                    />
                    <hr className="border-gray-600 my-1 w-full" />

                    <button
                        type="submit"
                        onClick={()=> handleLogin}
                        className="mt-5 w-full bg-[#5eb7b7] text-white px-11 py-4 rounded text-xs">
                        Log in
                    </button>
                </form>

                <Link to='/admin/register'>
                    <p className="mt-5 text-[#5eb7b7] text-sm underline">Create account</p>
                </Link>
            </div>

        </div>
    </div>
  )
}

export default NewAdminLogin;


























