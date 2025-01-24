import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { useContext, useState } from "react";
import axios from "axios";
import { URL } from "../url";
import { UserContext } from "../context/UserContext";
import { toast, Toaster } from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        URL + "/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      console.log(res.data);
      const token = res.data.token;
      localStorage.setItem("token", token);
      setUser(res.data.user);
      toast.success("User Successfully Logged-In", { duration: 3000 });
      setError(null);
      setTimeout(() => navigate("/about"), 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Login failed";
      setError(errorMessage);
      toast.error(errorMessage, { duration: 3000 });
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation bar */}
      <div className="flex items-center justify-between px-6 md:px-[200px] py-4 bg-gray-900">
        <div className="flex flex-row gap-2">
          <img src="/NavLogo.png" alt="Logo" width={50} height={60} />

          <h1 className=" flex justify-center items-center text-md md:text-lg font-cursive text-shadow-lg text-gray-100 cursor-pointer font-semibold">
            ScribblyPosts
          </h1>
        </div>
        <div className="flex justify-between md:gap-4 gap-2">
          <h3>
            <Link to="/about" className="text-gray-100 text-sm md:text-md">
              About
            </Link>
          </h3>
          <h3>
            <Link to="/register" className="text-gray-100 text-sm md:text-md">
              Register
            </Link>
          </h3>
        </div>
      </div>

      {/* Main content with responsive background images */}
      <div
        className="flex-1 relative flex justify-center items-center 
                   bg-cover bg-center 
                   sm:bg-[url('/PhoneBg.png')] 
                   md:bg-[url('/TabletBg.png')] 
                   lg:bg-[url('/loginBg.png')] 
                   bg-[url('/loginBg.png')]"
      >
        {/* Overlay for better readability */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Login Card */}
        <div className="relative z-10 bg-white p-8 rounded-xl shadow-2xl w-[80%] md:w-[45%] max-w-md">
          <div className="flex flex-col justify-center items-center space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Log in to your account
            </h1>

            {/* Error Message */}
            {error && (
              <div className="w-full bg-red-50 text-red-600 py-3 px-4 rounded-lg text-center">
                {error}
              </div>
            )}

            <input
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border-2 border-blue-300 rounded-lg outline-0 focus:border-blue-600 bg-blue-100"
              type="text"
              placeholder="Enter your Email"
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border-2 border-blue-300 focus:border-blue-600 bg-blue-100 rounded-lg outline-0"
              type="password"
              placeholder="Enter your Password"
            />
            <button
              onClick={handleLogin}
              className="w-full px-4 py-4 text-lg rounded-lg font-bold text-white bg-gray-800 hover:bg-blue-800 transition-colors duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md"
            >
              Login
            </button>
            <div className="flex justify-center items-center space-x-3">
              <p className="">New here?</p>
              <p className=" text-gray-500 hover:text-blue-500 font-semibold">
                <Link to="/register">Register</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <Toaster />
    </div>
  );
};

export default Login;
