"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function HoldUpMessage() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 flex items-center justify-center px-4 z-50"
        >
          <div className="w-full max-w-xl h-auto sm:h-[250px] bg-cream-card text-center flex flex-col justify-center items-center border border-cream-dark/80 rounded-[2.5rem] shadow-xl p-8 mx-auto font-sans-clean">
            <h1 className="text-2xl sm:text-4xl font-serif-elegant font-normal text-charcoal leading-relaxed">
              Hold up<span className="text-indigo-600">.</span>
            </h1>
            <p className="text-charcoal/60 text-sm sm:text-base mt-3 max-w-md">
              Let&apos;s make a real commitment to your future self.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
