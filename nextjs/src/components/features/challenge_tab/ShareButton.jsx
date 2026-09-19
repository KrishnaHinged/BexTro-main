"use client";

import React from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

const ShareButton = () => {
  const handleShare = () => {
    const shareText = `Hey friends! I’m crushing it with Bextro challenges. Join me at ${window.location.origin}/signup`;
    navigator.clipboard.writeText(shareText);
    toast.success("Copied to clipboard!");
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleShare}
      className="px-6 py-3 bg-charcoal text-white rounded-full font-semibold hover:bg-black transition-colors shadow-md text-xs cursor-pointer"
    >
      Share with Friends <span className="ml-2">🚀</span>
    </motion.button>
  );
};

export default ShareButton;
