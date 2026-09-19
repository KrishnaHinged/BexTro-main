"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InterestsScreen from "@/components/features/welcome/interestsScreen";
import HoldUpMessage from "@/components/features/welcome/HoldUpMessage";
import RestartPrompt from "@/components/features/welcome/RestartPrompt";

export default function Welcome() {
  const [step, setStep] = useState(1);

  const nextScreen = (nextStep) => {
    setStep(nextStep);
  };

  useEffect(() => {
    const stepTimer = setTimeout(() => setStep(2), 5000);
    return () => clearTimeout(stepTimer);
  }, []);

  return (
    <motion.div className="flex flex-col justify-center items-center min-h-screen overflow-hidden bg-cream text-charcoal font-sans-clean relative transition-all">
      {step === 1 && <HoldUpMessage />}
      {step === 2 && <RestartPrompt nextScreen={nextScreen} />}
      <AnimatePresence mode="wait">
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <InterestsScreen nextScreen={nextScreen} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
