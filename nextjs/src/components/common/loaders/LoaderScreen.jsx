"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WELCOME_WORDS = ["Welcome", "to", "BeXtro"];

export default function LoaderScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setCurrentIndex(1), 900);
    const t2 = setTimeout(() => setCurrentIndex(2), 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div
      id="loader"
      className="fixed inset-0 flex justify-center items-center bg-black z-[999] overflow-hidden select-none h-screen"
    >
      <div className="relative flex items-center justify-center w-full max-w-4xl px-6 min-h-[140px] text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 1.04 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ willChange: "transform, opacity" }}
            className="inline-flex justify-center items-center"
          >
            <h1
              className="bextro-gradient-text text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight select-none"
              style={{
                background: "linear-gradient(to right, rgb(47, 47, 255), rgb(255, 180, 255))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                color: "transparent",
                filter: "drop-shadow(0 0 32px rgba(99, 102, 241, 0.45))",
                fontFamily: "'Outfit', sans-serif"
              }}
            >
              {WELCOME_WORDS[currentIndex]}
            </h1>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
