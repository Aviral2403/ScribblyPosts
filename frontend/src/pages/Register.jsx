import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import axios from "axios";
import { URL } from "../url";
import { toast, Toaster } from "react-hot-toast";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check password criteria dynamically
    setPasswordCriteria({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  }, [password]);

  const handleRegister = async () => {
    // Validate all criteria before submission
    const allCriteriaMet = Object.values(passwordCriteria).every(Boolean);
    
    if (!allCriteriaMet) {
      setError("Please meet all password requirements");
      return;
    }

    try {
      const res = await axios.post(URL + "/api/auth/register", {
        username,
        email,
        password,
      });
      setError(null);
      setRegistrationSuccess(true);
      toast.success("User Successfully Registered!", { duration: 3000 });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Registration failed";
      setError(errorMessage);
      toast.error(errorMessage, { duration: 3000 });
      setRegistrationSuccess(false);
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-white tracking-tight hover:text-gray-200 transition">
                ScribblyPosts
              </h1>
            </Link>
            <div className="flex items-center space-x-6">
              <Link
                to="/login"
                className="text-gray-300 hover:text-white transition font-medium"
              >
                Login
              </Link>
              <Link
                to="/about"
                className="text-gray-300 hover:text-white transition font-medium"
              >
                About
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 relative">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center 
                     sm:bg-[url('/PhoneBg.png')] 
                     md:bg-[url('/TabletBg.png')] 
                     lg:bg-[url('/loginBg.png')] 
                     bg-[url('/loginBg.png')]"
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <main className="relative flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg w-full bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-gray-900">
                Create An Account
              </h2>
              <p className="text-blue-500 font-semibold">
                Join our community and start sharing your stories
              </p>
            </div>

            <form className="space-y-6">
              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg transition duration-200 outline-none border-blue-300 focus:border-blue-600 bg-blue-100 border-2"
                  placeholder="Enter your username"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg transition duration-200 outline-none border-blue-300 focus:border-blue-600 bg-blue-100 border-2"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg transition duration-200 outline-none border-blue-300 focus:border-blue-600 bg-blue-100 border-2"
                  placeholder="Create a password"
                />
                
                {/* Password Criteria */}
                <div className="mt-2 text-sm space-y-1">
                  <div className={`flex items-center ${passwordCriteria.length ? 'text-green-600' : 'text-red-600'}`}>
                    {passwordCriteria.length ? '✓' : '✗'} At least 8 characters
                  </div>
                  <div className={`flex items-center ${passwordCriteria.uppercase ? 'text-green-600' : 'text-red-600'}`}>
                    {passwordCriteria.uppercase ? '✓' : '✗'} One uppercase letter
                  </div>
                  <div className={`flex items-center ${passwordCriteria.lowercase ? 'text-green-600' : 'text-red-600'}`}>
                    {passwordCriteria.lowercase ? '✓' : '✗'} One lowercase letter
                  </div>
                  <div className={`flex items-center ${passwordCriteria.number ? 'text-green-600' : 'text-red-600'}`}>
                    {passwordCriteria.number ? '✓' : '✗'} One number
                  </div>
                  <div className={`flex items-center ${passwordCriteria.specialChar ? 'text-green-600' : 'text-red-600'}`}>
                    {passwordCriteria.specialChar ? '✓' : '✗'} One special character
                  </div>
                </div>
              </div>

              {/* Register Button */}
              <button
                type="button"
                onClick={handleRegister}
                className="w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md"
              >
                Register
              </button>

              {/* Error Message */}
              {error && (
                <div className="text-center bg-red-50 text-red-600 py-3 px-4 rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              {/* Login Redirect */}
              <div className="text-center text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-gray-500 hover:text-blue-500 font-semibold"
                >
                  Login
                </Link>
              </div>
            </form>
          </div>
        </main>
      </div>

      <Footer />
      <Toaster />
    </div>
  );
};

export default Register;