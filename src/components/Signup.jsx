import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    middlename: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5001/api/auth/signup", {
        firstname: formData.firstname,
        lastname: formData.lastname,
        middlename: formData.middlename,
        email: formData.email,
        password: formData.password,
      });

      console.log("Signup response:", res.data);
      alert("Signup successful");
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err.response?.data || err.message);
      alert(err.response?.data || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative">
      <div className="w-full max-w-lg relative">
        {/* Admin panel design container */}
        <div className="bg-white/[0.08] backdrop-blur-sm border border-white/20 rounded-lg shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-700 to-slate-600 px-8 py-6 border-b border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Admin Portal</h1>
                <p className="text-sm text-gray-400">
                  Create Administrator Account
                </p>
              </div>
            </div>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-white mb-2">
                Create Admin Account
              </h2>
              <p className="text-gray-400">
                Register a new administrator for the system
              </p>
            </div>

            {/* First + Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  required
                  placeholder="Enter first name"
                  className="w-full px-3 py-3 bg-white/10 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  required
                  placeholder="Enter last name"
                  className="w-full px-3 py-3 bg-white/10 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-200"
                />
              </div>
            </div>

            {/* Middle Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Middle Name
              </label>
              <input
                type="text"
                name="middlename"
                value={formData.middlename}
                onChange={handleChange}
                required
                placeholder="Enter middle name"
                className="w-full px-3 py-3 bg-white/10 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-200"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Administrator Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="admin@company.com"
                  className="w-full pl-10 pr-3 py-3 bg-white/10 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-200"
                />
              </div>
            </div>

            {/* Password + Confirm */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter secure password"
                  className="w-full px-3 py-3 bg-white/10 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm your password"
                  className="w-full px-3 py-3 bg-white/10 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-200"
                />
              </div>
            </div>

            {/* Info Box */}
            <div className="flex items-start space-x-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <svg
                className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="text-sm text-blue-300 font-medium">
                  Administrator Privileges
                </p>
                <p className="text-xs text-blue-400/80 mt-1">
                  This account will have full administrative access to the
                  system
                </p>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/30 flex items-center justify-center space-x-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
              <span>Create Administrator Account</span>
            </button>

            {/* Footer links */}
            <div className="mt-8 pt-6 border-t border-white/10 flex justify-between text-sm">
              <span className="text-gray-400 hover:text-gray-300 cursor-pointer transition-colors">
                Need Help?
              </span>
              <span
                onClick={() => navigate("/login")}
                className="text-blue-400 hover:text-blue-300 cursor-pointer transition-colors"
              >
                Back to Login
              </span>
            </div>
          </form>

          {/* Footer Security Info */}
          <div className="bg-slate-700/50 px-8 py-3 border-t border-white/10">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Secure Registration</span>
              <span>Admin Portal v2.1.0</span>
            </div>
          </div>
        </div>

        {/* Status indicators */}
        <div className="mt-6 flex justify-center space-x-4 text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>System Online</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>SSL Secured</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
