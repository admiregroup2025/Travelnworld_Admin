import React, { useState } from "react";
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    if (!role || role === "user") {
      setErrorMessage("Please select a valid role");
      setLoading(false);
      return;
    }

    if (
      email === "superadmin@gmail.com" &&
      password === "superadmin12345" &&
      role === "superadmin"
    ) {
      onLogin(); // Notify parent component of successful login
      navigate("/"); // Navigate to home/dashboard
    } else {
      setErrorMessage("Invalid email, password, or role");
    }

    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#f8fafc" }}
    >
      <div className="bg-white rounded-2xl shadow-md max-w-md w-full overflow-hidden font-sans p-12">
        <div className="flex flex-col justify-center">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-gray-700 font-medium text-lg">
              Please sign in to your account
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="relative">
              <MdEmail
                className="absolute left-4 top-4 text-indigo-500"
                size={24}
              />
              <input
                type="email"
                className="w-full pl-14 pr-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 transition duration-300 ease-in-out text-gray-900 placeholder-gray-400"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                spellCheck="false"
              />
            </div>

            <div className="relative">
              <MdLock
                className="absolute left-4 top-4 text-indigo-500"
                size={24}
              />
              <input
                type={showPassword ? "text" : "password"}
                className="w-full pl-14 pr-14 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 transition duration-300 ease-in-out text-gray-900 placeholder-gray-400"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                spellCheck="false"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-gray-500 hover:text-indigo-600 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <MdVisibilityOff size={24} />
                ) : (
                  <MdVisibility size={24} />
                )}
              </button>
            </div>

            <div>
              <label
                htmlFor="role"
                className="block mb-1 font-medium text-gray-700"
              >
                Select Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full py-3 px-5 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 transition duration-300 ease-in-out text-gray-900"
                required
              >
                <option value="user" disabled>
                  Select
                </option>
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
              </select>
            </div>

            {errorMessage && (
              <p className="text-red-600 text-center text-sm animate-pulse">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer w-full py-3 rounded-xl bg-indigo-600 text-white text-lg font-semibold hover:bg-indigo-700 transition duration-300 ease-in-out shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-500 text-sm select-none">
            © 2025 Your Company. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
