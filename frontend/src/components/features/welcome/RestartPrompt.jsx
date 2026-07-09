import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const RestartPrompt = ({ nextScreen }) => {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 flex items-center justify-center px-4 z-50"
      >
        <div className="w-full max-w-xl bg-cream-card text-center flex flex-col justify-center items-center border border-cream-dark/80 rounded-[2.5rem] shadow-xl p-8 sm:p-10 font-sans-clean">
          <h1 className="text-xl sm:text-3xl font-serif-elegant font-normal text-charcoal leading-relaxed">
            Just imagine you are somehow 3 years back in your life.
          </h1>
          <p className="text-charcoal/60 text-sm sm:text-base mt-3">
            What are all the things you are going to start again?
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
            <motion.button
              onClick={() => nextScreen(4)}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-8 py-3 bg-charcoal hover:bg-black text-white text-sm font-semibold rounded-full shadow-md transition cursor-pointer"
            >
              Restart!!
            </motion.button>
            <button
              onClick={() => navigate("/")}
              className="w-full sm:w-auto px-8 py-3 border border-charcoal/20 hover:bg-charcoal/5 text-charcoal text-sm font-semibold rounded-full transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RestartPrompt;
