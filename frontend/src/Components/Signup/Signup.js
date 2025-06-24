import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import './Signup.css'

function Signup({ setLoginPage }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  setLoading(true);

  // Wait for 3 seconds before submitting (simulated delay)
  setTimeout(() => {
    axios
      .post("http://localhost:5000/api/user/signup", {
        name,
        email,
        password,
        pic,
      })
      .then((res) => {
        if (res.data === "Exists") {
          toast.warn("User already exists!", {
                    position: "top-right",
                    autoClose: 2000,
                    className: "custom-toast-error",
                  });
        } else if (
          (res.status === 200 || res.status === 201) &&
          res.data.token
        ) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("userId", res.data.userId);
          localStorage.setItem("username", res.data.username);
          toast.success("Account created successfully!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            className:"custom-toast"
          });
        } else {
          toast.error("An error occurred. Please try again.", {
                    position: "top-right",
                    autoClose: 2000,
                    className: "custom-toast-error",
                  });
        }
      })
      .catch((err) => {
        toast.error("Signup Error, Try again.", {
                  position: "top-right",
                  autoClose: 2000,
                  className: "custom-toast-error",
                });
        console.error("Axios error", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, 1500);
};



  return (
    <div className="signup-wrapper w-full h-full p-2 md:p-3 md:mb-3 sm:p-8 overflow-y-auto sup-container">
       <div className="signup-bg-image"></div>
      <div className="max-w-md w-full mx-auto bg-white signup-content">
        <h2 className="text-2xl font-bold text-center text-[#197389]">
          Signup
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 px-4 sm:px-6">
          <div className="signup-box"> 
            <label htmlFor="name" className="block text-lg font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="block w-full p-3 border-2 border-gray-300 rounded focus:outline-none focus:border-[#197389]"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="signup-box">
            <label htmlFor="email" className="block text-lg font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="block w-full p-3 border-2 border-gray-300 rounded focus:outline-none focus:border-[#197389]"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-lg font-medium mb-1"
            >
              Password
            </label>
            <div className="flex items-center border-2 signup-box bg-white border-gray-300 rounded-lg focus-within:border-[#197389]">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full rounded-md focus:outline-none pwd p-3"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-3 px-4 eye-icon text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          <div className="signup-box">
            <label htmlFor="pic" className="block text-lg font-medium mb-1">
              Upload Your Picture
            </label>
            <input
              type="file"
              id="pic"
              className="file-inp block mb-1 w-full p-3 border-2 border-gray-300 rounded focus:outline-none focus:border-[#197389]"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

       <button
  type="submit"
  disabled={loading}
  className={`w-full mt-2  text-lg font-semibold text-white
    bg-gradient-to-r from-[#197389] to-[#1e96a3] 
    rounded-lg sgup-btn shadow-md transition-all duration-300 ease-in-out transform
    hover:from-[#155d6c] hover:to-[#197389] hover:scale-105
    focus:outline-none focus:ring-4 focus:ring-[#a1d3dc]
    ${loading ? "cursor-not-allowed" : ""}
  `}
>
  {loading ? (
    <div className="flex justify-center items-center gap-2">
      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      Signing Up...
    </div>
  ) : (
    "Sign Up"
  )}
</button>



        </form>

        <p className="mt-4 text-center text-base">
          Already have an account?{" "}
          <button
            onClick={() => setLoginPage(true)}
            className="text-[#197389] font-semibold hover:underline"
          >
            Login
          </button>
        </p>
      </div>
      <ToastContainer /> 
    </div>
  );
}

export default Signup;
