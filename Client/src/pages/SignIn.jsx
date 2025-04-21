import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { IoEyeOutline, IoEyeOffOutline, IoLogoApple } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import toast, { Toaster } from "react-hot-toast";
import CustomButton from "../components/UI/CustomButton";
import SideImage from "../assets/signIn/signIn.jpg";
import { AuthContext } from "../context/AuthContext";

function SignIn() {
  const navigate = useNavigate();
  const context = useContext(AuthContext);

  console.log("AuthContext:", context);

  if (!context) {
    console.error("AuthContext is not provided");
    return <div>Error: Authentication context not found</div>;
  }

  const { setUser } = context;

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleGoogleSignIn = () => {
    window.location.href = `/api/v1/auth/google`;
  };

  const handleAppleSignIn = () => {
    window.location.href = `/api/v1/auth/facebook`;
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  const handleEmailBlur = () => {
    if (!email) {
      setEmailError("Email is required");
      toast.error("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email");
      toast.error("Please enter a valid email");
    }
  };

  const handleFormSubmit = async () => {
    setEmailError("");
    setPasswordError("");

    if (!email) {
      setEmailError("Email is required");
      return toast.error("Email is required");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Invalid email address");
      return toast.error("Invalid email address");
    }

    if (!password) {
      setPasswordError("Password is required");
      return toast.error("Password is required");
    }

    try {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        toast.success("Successfully signed in!");
        navigate("/");
      } else {
        const errorMessage = data.msg || "Invalid credentials";
        setEmailError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="mx-auto flex w-full mt-20 lg:mt-0 max-w-[1920px] flex-col lg:flex-row">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Laptop Image */}
      <div className="hidden lg:block lg:w-[55%]">
        <img
          src={SideImage}
          alt="Laptop Background"
          className="h-screen w-full object-cover"
        />
      </div>

      {/* Form Section */}
      <div className="flex w-full flex-col px-[20px] pt-[20px] sm:px-[30px] sm:pt-[30px] md:px-20 lg:w-[45%] lg:px-[60px] lg:pt-[80px] clap-px-[165px] clap-pt-[154px]">
        {/* Logo - Visible on all screens */}
        <div className="w-full mb-4 hidden lg:block">
          <span className="text-4xl font-bold text-green-600">GeoFinder</span>
        </div>

        {/* Sign In Section */}
        <div className="flex w-full flex-col lg:mt-10">
          <h2 className="font-PlusSans text-[24px] font-bold leading-[32px] text-[#000] lg:text-[36px]">
            Welcome Back
          </h2>
          <span className="mt-5 font-PlusSans text-sm font-medium leading-6 text-black lg:text-base lg:leading-8">
            Sign in to continue to your account
          </span>

          {/* Email Input */}
          <div className="mt-[32px]">
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              placeholder="Username@example.com"
              className="w-full font-PlusSans text-[14px] font-normal leading-[24px] text-black placeholder:text-[#646464] focus:outline-none"
            />
            <div className="mt-[4px] h-[1px] w-full bg-[#000]"></div>
            {emailError && (
              <p className="mt-1 text-xs text-red-500">{emailError}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="relative mt-[36px]">
            <input
              type={passwordVisible ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter your Password"
              className="w-full font-PlusSans text-[14px] font-normal leading-[24px] text-black placeholder:text-[#646464] focus:outline-none"
            />
            <div
              className="absolute right-4 top-1/2 -translate-y-1/2 transform cursor-pointer"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? (
                <IoEyeOutline size={20} color="#646464" />
              ) : (
                <IoEyeOffOutline size={20} color="#646464" />
              )}
            </div>
            <div className="mt-[4px] h-[1px] w-full bg-[#000]"></div>
            {passwordError && (
              <p className="mt-1 text-xs text-red-500">{passwordError}</p>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="mt-2 flex w-full items-end justify-end">
            <span
              onClick={() => navigate("/forgot-password")}
              className="cursor-pointer font-PlusSans text-[14px] text-green-600 hover:text-green-700 hover:underline"
            >
              Forgot Password?
            </span>
          </div>

          {/* Sign In Button */}
          <div className="mt-[32px] w-full">
            <CustomButton
              title="Sign In"
              bgColor="bg-green-600"
              textColor="text-white"
              onClick={handleFormSubmit}
              style="hover:bg-green-700"
            />
          </div>

          <div className="mt-[23px] flex items-center justify-center font-PlusSans text-sm leading-6 text-black">
            or continue with
          </div>

          {/* Social Login Buttons */}
          <div className="mt-[24px] flex items-center justify-center space-x-[9px] lg:mt-[46px]">
            <div
              className="flex h-[46px] w-[105px] cursor-pointer items-center justify-center border-[1px] border-[#00000033] bg-white hover:border-2 hover:border-green-600"
              onClick={handleGoogleSignIn}
            >
              <FcGoogle size={24} />
            </div>
            <div
              className="flex h-[46px] w-[105px] cursor-pointer items-center justify-center border-[1px] border-[#00000033] bg-white hover:border-2 hover:border-green-600"
              onClick={handleAppleSignIn}
            >
              <IoLogoApple size={24} />
            </div>
          </div>

          {/* Sign Up Link */}
          <h1 className="mt-[12px] flex items-center justify-center font-PlusSans text-sm leading-6 text-[#646464]">
            Don't have an account?{" "}
            <span
              className="ml-2.5 cursor-pointer font-semibold text-green-600 hover:text-green-700 hover:underline"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </h1>
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-center py-3 font-PlusSans text-xs leading-6 text-black lg:py-7">
          2025 © All rights reserved. GeoFinder
        </div>
      </div>
    </div>
  );
}

export default SignIn;