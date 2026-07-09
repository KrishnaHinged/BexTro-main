import React, { useState, useEffect, memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { logoutUser } from "../redux/userSlice.js";
import OtherUsers_Admin from "../components/features/admin/OtherUsers_Admin.jsx";
import ProfileTab from "../components/features/setting_tab/ProfileTab.jsx";
import Analytics from "../components/features/admin/analytics.jsx";
import ReportManagement from "../components/features/admin/ReportManagement.jsx";
import PostManagement from "../components/features/admin/PostManagement.jsx";
import { AnimatePresence, motion } from "framer-motion";
import AdminSlideBar from "../components/features/admin/AdminSlideBar.jsx";
import axiosInstance from "../api/axios.js";
import { FaUsers, FaFlag, FaStream, FaProjectDiagram } from "react-icons/fa";

// Stats Card Redesign
const StatsCard = memo(({ title, value, icon, color }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="p-6 rounded-3xl bg-cream-card border border-cream-dark/85 flex items-center gap-5 flex-1 min-w-[220px] shadow-sm font-sans-clean"
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

const AdminDashboard = ({ toggleTheme, currentTheme }) => {
  const [activeSection, setActiveSection] = useState("users");
  const [stats, setStats] = useState({
    users: 0,
    posts: 0,
    communities: 0,
    pendingReports: 0,
  });
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const validSections = new Set([
    "users",
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
      toast.error("Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const section = queryParams.get("section");

    if (section && validSections.has(section)) {
      setActiveSection(section);
    }

    fetchStats();
  }, [location.search, fetchStats]);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/user/logout");
      localStorage.clear();
      dispatch(logoutUser());
      toast.success("Logged out successfully ✌️");
      navigate("/signin");
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
        currentTheme={currentTheme}
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
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-white hover:bg-cream border border-cream-dark/80 cursor-pointer shadow-sm flex items-center justify-center"
            >
              <div className="w-5 h-5 flex items-center justify-center text-charcoal/70">
                {currentTheme.navbarIcon}
              </div>
            </button>

            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
              AD
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-6 mb-10">
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
                title="Global Posts"
                value={stats.posts}
                icon={<FaStream size={18} className="text-indigo-600" />}
                color="bg-indigo-500"
              />
              <StatsCard
                title="Communities"
                value={stats.communities}
                icon={<FaProjectDiagram size={18} className="text-purple-600" />}
                color="bg-purple-500"
              />
              <StatsCard
                title="Pending Reports"
                value={stats.pendingReports}
                icon={<FaFlag size={18} className="text-red-600" />}
                color="bg-red-500"
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
};

export default AdminDashboard;