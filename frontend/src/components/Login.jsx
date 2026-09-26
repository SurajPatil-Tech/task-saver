import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigateTo = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
       `${import.meta.env.VITE_API_URL}/user/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("LOGIN RESPONSE:", response.data);

      // This is optional because your backend uses the cookie.
      if (response.data.token) {
        localStorage.setItem("jwt", response.data.token);
      }

      toast.success(
        response.data.message || "User logged in successfully"
      );

      setEmail("");
      setPassword("");

      // Navigate only after successful login request
      navigateTo("/", { replace: true });
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.errors ||
        "Login failed";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-5 text-center text-2xl font-semibold">
          Login
        </h2>

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div className="mb-4">
            <label
              className="mb-2 block font-semibold"
              htmlFor="email"
            >
              Email
            </label>

            <input
              id="email"
              className="w-full rounded border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Type Email"
              autoComplete="email"
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label
              className="mb-2 block font-semibold"
              htmlFor="password"
            >
              Password
            </label>

            <input
              id="password"
              className="w-full rounded border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Type Password"
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 p-3 font-semibold text-white duration-300 hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="mt-4 text-center text-gray-600">
            New user?{" "}
            <Link
              to="/signup"
              className="text-blue-600 hover:underline"
            >
              Signup
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;