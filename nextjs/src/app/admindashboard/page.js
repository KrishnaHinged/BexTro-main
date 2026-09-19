"use client";

import React, { useState, useEffect, memo, useCallback, Suspense } from "react";
import { useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { logoutUser } from "@/redux/userSlice";
import OtherUsers_Admin from "@/components/features/admin/OtherUsers_Admin";
import ProfileTab from "@/components/features/setting_tab/ProfileTab";
import Analytics from "@/components/features/admin/analytics";
import ReportManagement from "@/components/features/admin/ReportManagement";
import PostManagement from "@/components/features/admin/PostManagement";
import GoalManagement from "@/components/features/admin/GoalManagement";
import ChallengeManagement from "@/components/features/admin/ChallengeManagement";
import { AnimatePresence, motion } from "framer-motion";
import AdminSlideBar from "@/components/features/admin/AdminSlideBar";
import axiosInstance from "@/api/axios";
import { FaUsers, FaFlag, FaStream, FaBullseye, FaTrophy } from "react-icons/fa";

const StatsCard = memo(({ title, value, icon, color }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="p-6 rounded-3xl bg-cream-card border border-cream-dark/85 flex items-center gap-5 flex-1 min-w-[200px] shadow-sm font-sans-clean"
  >
    <div className={`p-3.5 rounded-2xl ${color} bg-opacity-15 text-charcoal shadow-inner flex items-center justify-center shrink-0`}>
      {icon}
    </div>
    <div>
      <p className="text-charcoal/50 text-[10px] font-bold uppercase tracking-wider mb-0.5">
        {title}
      </p>
      <p className="text-charcoal text-2xl font-bold">{value}</p>
    </div>
  </motion.div>
));
StatsCard.displayName = "StatsCard";

function AdminDashboardContent() {
  const [activeSection, setActiveSection] = useState("users");
  const [stats, setStats] = useState({
    users: 0,
    posts: 0,
    totalGoals: 0,
    completedTasks: 0,
    pendingReports: 0,
  });
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const validSections = new Set([
    "users",
    "goals",
    "challenges",
    "analytics",
    "settings",
    "reports",
    "posts",
  ]);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/admin/stats");
      setStats(res.data);
    } catch (error) {
      console.error("Fetch stats error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const section = searchParams?.get("section");

    if (section && validSections.has(section)) {
      setActiveSection(section);
    }

    fetchStats();
  }, [searchParams, fetchStats]);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/user/logout");
      localStorage.clear();
      dispatch(logoutUser());
      toast.success("Logged out successfully ✌️");
      router.push("/signin");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed 😢");
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.2 } },
  };

  return (
    <div className="flex min-h-screen bg-cream text-charcoal font-sans-clean">
      <AdminSlideBar
        onLogout={handleLogout}
        setActiveSection={setActiveSection}
      />

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <motion.h1
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-3xl md:text-5xl font-serif-elegant font-normal text-charcoal tracking-tight"
            >
              Management Console<span className="text-indigo-600">.</span>
            </motion.h1>
            <p className="text-charcoal/50 text-xs sm:text-sm font-medium mt-1.5">
              Welcome back, Admin. System is running at optimal capacity.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
              AD
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 mb-10">
          {loading ? (
            <p className="text-charcoal/45 text-xs italic font-medium">Loading stats...</p>
          ) : (
            <>
              <StatsCard
                title="Total Users"
                value={stats.users}
                icon={<FaUsers size={18} className="text-blue-600" />}
                color="bg-blue-500"
              />
              <StatsCard
                title="Active Goals"
                value={stats.totalGoals || 0}
                icon={<FaBullseye size={18} className="text-emerald-600" />}
                color="bg-emerald-500"
              />
              <StatsCard
                title="Verified Proofs"
                value={stats.posts}
                icon={<FaStream size={18} className="text-indigo-600" />}
                color="bg-indigo-500"
              />
              <StatsCard
                title="Completed Tasks"
                value={stats.completedTasks || 0}
                icon={<FaTrophy size={18} className="text-amber-600" />}
                color="bg-amber-500"
              />
              <StatsCard
                title="Pending Reports"
                value={stats.pendingReports}
                icon={<FaFlag size={18} className="text-rose-600" />}
                color="bg-rose-500"
              />
            </>
          )}
        </div>

        <div className="h-px bg-cream-dark/60 w-full mb-10" />

        {/* Sections Wrapper */}
        <AnimatePresence mode="wait">
          <motion.section
            key={activeSection}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="rounded-[3rem] bg-cream-card border border-cream-dark/80 p-8 shadow-xl min-h-[500px]"
          >
            {activeSection === "users" && (
              <div>
                <h2 className="text-2xl font-serif-elegant font-normal text-charcoal mb-6">
                  User Management
                </h2>
                <OtherUsers_Admin />
              </div>
            )}

            {activeSection === "goals" && <GoalManagement />}
            {activeSection === "challenges" && <ChallengeManagement />}
            {activeSection === "reports" && <ReportManagement />}
            {activeSection === "posts" && <PostManagement />}
            {activeSection === "analytics" && <Analytics />}

            {activeSection === "settings" && (
              <div className="p-2 sm:p-4">
                <h2 className="text-2xl font-serif-elegant font-normal text-charcoal mb-6">
                  Administrative Settings
                </h2>
                <ProfileTab onLogout={handleLogout} />
              </div>
            )}
          </motion.section>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading dashboard...</div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}
