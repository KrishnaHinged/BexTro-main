"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axiosInstance from "@/api/axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

export default function SignUp() {
  const [user, setUser] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmpassword: "",
    gender: "",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (user.password !== user.confirmpassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (!user.gender) {
      toast.error("Please select a gender!");
      return;
    }

    setLoading(true);

    try {
      const res = await axiosInstance.post("/user/register", user);

      if (res.data.success) {
        toast.success(res.data.message || "Account created successfully!");
        router.push("/signin");
      }

      setUser({
        fullName: "",
        username: "",
        password: "",
        confirmpassword: "",
        gender: "",
      });
    } catch (error) {
      console.error("Signup error:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "An error occurred. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-cream font-sans-clean px-4 py-8 relative overflow-hidden">
      
      <Link href="/" className="absolute top-8 left-8 text-sm font-semibold text-charcoal/60 hover:text-charcoal transition-colors">
        ← Back to Home
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-cream-card border border-cream-dark/80 p-8 sm:p-10 rounded-[2.5rem] shadow-xl w-full max-w-md my-6"
      >
        <div className="text-center mb-8">
          <h2 className="text-4xl font-serif-elegant font-normal text-charcoal tracking-tight">
            Create account
          </h2>
          <p className="text-charcoal/60 text-xs sm:text-sm mt-2">
            Start tracking real progress in silence.
          </p>
        </div>

        <form onSubmit={onSubmitHandler} className="space-y-4">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50 ml-1 mb-1.5 block">
              Full Name
            </label>
            <input 
              type="text" 
              value={user.fullName} 
              placeholder="Enter your full name" 
              className="border border-cream-dark/80 bg-white px-4 py-3 w-full rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-charcoal placeholder-charcoal/30 text-sm font-medium" 
              required 
              onChange={(e) => setUser({ ...user, fullName: e.target.value })} 
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50 ml-1 mb-1.5 block">
              Username
            </label>
            <input 
              type="text" 
              value={user.username} 
              placeholder="Pick a unique username" 
              className="border border-cream-dark/80 bg-white px-4 py-3 w-full rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-charcoal placeholder-charcoal/30 text-sm font-medium" 
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
              placeholder="Create a strong password" 
              className="border border-cream-dark/80 bg-white px-4 py-3 w-full rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-charcoal placeholder-charcoal/30 text-sm font-medium" 
              required 
              onChange={(e) => setUser({ ...user, password: e.target.value })} 
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50 ml-1 mb-1.5 block">
              Confirm Password
            </label>
            <input 
              type="password" 
              value={user.confirmpassword} 
              placeholder="Confirm your password" 
              className="border border-cream-dark/80 bg-white px-4 py-3 w-full rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-charcoal placeholder-charcoal/30 text-sm font-medium" 
              required 
              onChange={(e) => setUser({ ...user, confirmpassword: e.target.value })} 
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50 ml-1 mb-2.5 block">
              Select Gender
            </label>
            <div className="flex justify-center items-center gap-4">
              <input 
                type="radio" 
                name="gender" 
                id="male" 
                value="Male" 
                className="hidden" 
                onChange={() => setUser({ ...user, gender: "Male" })} 
                checked={user.gender === "Male"} 
              />
              <label 
                htmlFor="male" 
                className={`flex-1 text-center py-3 rounded-2xl cursor-pointer border-2 transition-all font-semibold text-sm ${
                  user.gender === "Male" 
                    ? "bg-charcoal border-charcoal text-white shadow-md font-bold" 
                    : "bg-white border-cream-dark/60 text-charcoal/60 hover:bg-white/80"
                }`}
              >
                Male
              </label>

              <input 
                type="radio" 
                name="gender" 
                id="female" 
                value="Female" 
                className="hidden" 
                onChange={() => setUser({ ...user, gender: "Female" })} 
                checked={user.gender === "Female"} 
              />
              <label 
                htmlFor="female" 
                className={`flex-1 text-center py-3 rounded-2xl cursor-pointer border-2 transition-all font-semibold text-sm ${
                  user.gender === "Female" 
                    ? "bg-charcoal border-charcoal text-white shadow-md font-bold" 
                    : "bg-white border-cream-dark/60 text-charcoal/60 hover:bg-white/80"
                }`}
              >
                Female
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`bg-charcoal hover:bg-black text-white px-5 py-3.5 mt-6 w-full rounded-full font-bold shadow-lg transition-all text-sm tracking-wide ${
              loading 
                ? "opacity-70 cursor-not-allowed scale-95" 
                : "hover:scale-[1.02] active:scale-95 cursor-pointer"
            }`}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-charcoal/60">
          Already have an account?{" "}
          <Link href="/signin" className="text-indigo-600 font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
