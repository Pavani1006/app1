import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import './Login.css'

function Login({ setLoginPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  setTimeout(async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/user/login", {
        email,
        password,
      });

      if (res.data === "No such record exist") {
        alert("User not found. Please check your email or sign up.");
      } else if (res.data === "Password is incorrect") {
        toast.error("Incorrect password. Please try again.", {
          position: "top-right",
          autoClose: 2000,
          className: "custom-toast-error",
        });
      } else if (res.data.status === "Success") {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.userId);
        localStorage.setItem("username", res.data.username);
        toast.success("Login successful!", {
  position: "top-right",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  className:"custom-toast",
    onClose: () => navigate("/chats"),
});

        // You can redirect or change view here
      } else {
        toast.error("Unexpected response. Please try again.", {
          position: "top-right",
          autoClose: 2000,
          className: "custom-toast",
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Something went wrong. Please try again later.", {
        position: "top-right",
        autoClose: 2000,
        className: "custom-toast",
      });
    } finally {
      setLoading(false);
    }
  }, 1500); // 3-second simulated delay
};



  return (
    <div className="login-wrapper w-full h-full py-2 px-4 md:p-4 md:mb-3 sm:p-8 overflow-y-auto sup-container">
      <div className="max-w-md w-full mx-auto bg-white login-content">
        <h2 className="text-2xl font-bold mt-6 mb-7 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="email" className="block mb-2 text-lg font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full max-w-[90%] focus:outline-none focus:border-[#0c0c0c3e] p-3 border-2 rounded"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="password"
              className="block mb-2 text-lg font-medium"
            >
              Password
            </label>
            <div className="w-full max-w-[90%] flex items-center justify-between border-2 rounded px-3 py-3 focus-within:border-[#0c0c0c3e]">
 <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="focus:outline-none"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-500 hover:text-gray-700 ml-2"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          <button
  type="submit"
  disabled={loading}
  className={`w-full max-w-[90%] mt-2 px-6 py-3 text-lg font-semibold text-white
    bg-gradient-to-r from-[#197389] to-[#1e96a3]
    rounded-lg shadow-md transition-all duration-300 ease-in-out transform
    hover:from-[#155d6c] hover:to-[#197389] hover:scale-105
    focus:outline-none focus:ring-4 focus:ring-[#a1d3dc]
    ${loading ? "cursor-not-allowed" : ""}
  `}
>
  {loading ? (
    <div className="flex justify-center items-center gap-2">
      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      Logging in...
    </div>
  ) : (
    "Login"
  )}
</button>

        </form>

        <p className="mt-2 py-6 mr-5 text-center text-lg">
          Don't have an account?{" "}
          <button
            onClick={() => setLoginPage(false)}
            className="text-[#197389] font-semibold hover:underline"
          >
            Signup
          </button>
        </p>
      </div>
      <ToastContainer /> 
    </div>
  );
}

export default Login;
