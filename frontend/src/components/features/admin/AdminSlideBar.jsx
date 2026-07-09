import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiActivity, FiLogOut } from "react-icons/fi";
import { FaUsers, FaCog, FaFlag, FaStream, FaComment } from "react-icons/fa";
import { motion } from "framer-motion";

const AdminSlideBar = ({ onLogout, setActiveSection, currentTheme }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState("users");

  const menuItems = [
    { id: "users", label: "Users", icon: <FaUsers size={20} />, section: "users" },
    { id: "reports", label: "Reports", icon: <FaFlag size={18} />, section: "reports" },
    { id: "posts", label: "Posts", icon: <FaStream size={18} />, section: "posts" },
    { id: "analytics", label: "Analytics", icon: <FiActivity size={20} />, section: "analytics" },
    { id: "chat", label: "Chat", icon: <FaComment size={18} />, path: "/adminchats" },
    { id: "settings", label: "Settings", icon: <FaCog size={20} />, section: "settings" },
    { id: "logout", label: "Logout", icon: <FiLogOut size={20} />, section: null },
  ];

  useEffect(() => {
    const currentPath = location.pathname;
    const queryParams = new URLSearchParams(location.search);
    const section = queryParams.get("section");

    let activeItem;

    if (currentPath === "/admindashboard" && section) {
      activeItem = menuItems.find((item) => item.section === section);
    } else {
      activeItem = menuItems.find((item) => item.path === currentPath || `/admin/${item.section}` === currentPath);
    }

    if (activeItem) {
      setActive(activeItem.id);
      if (activeItem.section) {
        setActiveSection(activeItem.section);
      }
    } else {
      setActive("users");
      setActiveSection("users");
    }
  }, [location.pathname, location.search, setActiveSection]);

  const handleClick = (id, section, path) => {
    setActive(id);
    if (id === "logout") {
      onLogout();
    } else if (path) {
      navigate(path);
    } else {
      navigate(`/admindashboard?section=${section}`);
    }
  };

  return (
    <div className="bg-cream-card border-r border-cream-dark/65 h-screen w-20 sticky top-0 py-10 z-50 flex flex-col justify-between items-center font-sans-clean shadow-sm">
      <div className="flex flex-col gap-8 items-center w-full">
        {/* LOGO */}
        <div className="text-xl font-serif-elegant font-bold text-charcoal mb-4 cursor-pointer" onClick={() => navigate("/")}>
          A<span className="text-indigo-600">.</span>
        </div>

        {/* NAVIGATION ITEMS */}
        <div className="flex flex-col gap-5 items-center w-full px-2">
          {menuItems.map(({ id, label, icon, section, path }) => (
            <motion.button
              key={id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleClick(id, section, path)}
              className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 cursor-pointer ${
                active === id
                  ? "bg-charcoal text-white shadow-md"
                  : "text-charcoal/40 hover:text-charcoal hover:bg-cream/50"
              }`}
              title={label}
              aria-label={label}
            >
              {icon}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminSlideBar;