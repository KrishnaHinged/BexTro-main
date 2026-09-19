"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axiosInstance from "@/api/axios";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/redux/userSlice";
import { motion } from "framer-motion";

export default function SignIn() {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.post("/user/login", user);

      const loggedInUser = res.data.user;
      console.log("Logged in user:", loggedInUser);
      dispatch(setAuthUser(loggedInUser));

      if (loggedInUser.role === "admin") {
        router.push("/admindashboard");
      } else {
        router.push("/welcome");
      }

      toast.success("Logged in successfully!");

      setUser({
        username: "",
        password: "",
      });
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "An error occurred. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-cream font-sans-clean px-4 relative overflow-hidden">
      
      <Link href="/" className="absolute top-8 left-8 text-sm font-semibold text-charcoal/60 hover:text-charcoal transition-colors">
        ← Back to Home
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-cream-card border border-cream-dark/80 p-8 sm:p-10 rounded-[2.5rem] shadow-xl w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h2 className="text-4xl font-serif-elegant font-normal text-charcoal tracking-tight">
            Welcome back
          </h2>
          <p className="text-charcoal/60 text-xs sm:text-sm mt-2">
            Continue your action-backed journey.
          </p>
        </div>

        <form onSubmit={onSubmitHandler} className="space-y-4">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50 ml-1 mb-1.5 block">
              Username
            </label>
            <input
              type="text"
              value={user.username}
              placeholder="Enter your username"
              className="border border-cream-dark/80 bg-white px-4 py-3.5 w-full rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-charcoal placeholder-charcoal/30 text-sm font-medium"
              required
              onChange={(e) => setUser({ ...user, username: e.target.value })}
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50 ml-1 mb-1.5 block">
              Password
            </label>
            <input
              type="password"
              value={user.password}
              placeholder="Enter your password"
              className="border border-cream-dark/80 bg-white px-4 py-3.5 w-full rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-charcoal placeholder-charcoal/30 text-sm font-medium"
              required
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`bg-charcoal hover:bg-black text-white mt-6 px-5 py-3.5 w-full rounded-full font-bold shadow-lg transition-all text-sm tracking-wide ${
              loading
                ? "opacity-70 cursor-not-allowed scale-95"
                : "hover:scale-[1.02] active:scale-95 cursor-pointer"
            }`}
          >
            {loading ? "Logging in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-charcoal/60">
          Don't have an account?{" "}
          <Link href="/signup" className="text-indigo-600 font-bold hover:underline">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
