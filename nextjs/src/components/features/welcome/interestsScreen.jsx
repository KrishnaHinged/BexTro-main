"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "@/api/axios";
import BucketList from "../welcome/BucketList";
import { toast } from "react-hot-toast";

import { X, ArrowRight } from "lucide-react";

export default function InterestsScreen({ nextScreen }) {
    const [selectedInterests, setSelectedInterests] = useState(new Set());
    const [customInterest, setCustomInterest] = useState("");
    const [showBucketList, setShowBucketList] = useState(false);

    useEffect(() => {
        axiosInstance
            .get("/userdata/interests")
            .then((res) => setSelectedInterests(new Set(res.data.interests || [])))
            .catch((err) => {
                console.error("Error fetching interests:", err);
                toast.error("Failed to load interests");
            });
    }, []);

    const initialInterests = [
        { id: "coding", label: "Coding" },
        { id: "art", label: "Art" },
        { id: "music", label: "Music" },
        { id: "sports", label: "Sports" },
        { id: "travel", label: "Travel" },
    ];

    const handleInterestClick = (interest) => {
        const isAdding = !selectedInterests.has(interest);
        const action = isAdding ? "add" : "remove";

        axiosInstance
            .post("/userdata/interests", { interest, action })
            .then((res) => {
                setSelectedInterests(new Set(res.data.data || []));
                toast.success(isAdding ? "Interest added!" : "Interest removed!");
            })
            .catch((err) => {
                console.error(`Error ${isAdding ? "adding" : "removing"} interest:`, err);
                toast.error(err.response?.data?.error || "Failed to update interest");
            });
    };

    const addCustomInterest = () => {
        const value = customInterest.trim();
        if (!value) {
            toast.error("Please enter a valid interest!");
            return;
        }
        if (!selectedInterests.has(value)) {
            axiosInstance
                .post("/userdata/interests", { interest: value, action: "add" })
                .then((res) => {
                    setSelectedInterests(new Set(res.data.data || []));
                    setCustomInterest("");
                    toast.success("Custom interest added!");
                })
                .catch((err) => {
                    console.error("Error adding custom interest:", err);
                    toast.error(err.response?.data?.error || "Failed to add custom interest");
                });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans-clean">
            {!showBucketList ? (
                <div className="max-w-2xl w-full p-8 sm:p-10 bg-cream-card border border-cream-dark/80 rounded-[2.5rem] shadow-xl text-center relative z-10">
                    <h1 className="text-3xl sm:text-4xl font-serif-elegant font-normal text-charcoal mb-3">
                        What do you want to build?
                    </h1>
                    <p className="text-sm sm:text-base text-charcoal/60 mb-8">
                        Select areas of focus to tailor your challenge engine.
                    </p>

                    <div className="flex flex-wrap justify-center gap-3.5 mb-8">
                        {initialInterests.map(({ id, label }) => (
                            <motion.div
                                key={id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-5 py-3 rounded-2xl border text-sm font-semibold cursor-pointer transition-all duration-300 shadow-sm ${
                                    selectedInterests.has(id)
                                        ? "bg-charcoal border-charcoal text-white shadow-md"
                                        : "bg-white border-cream-dark/60 text-charcoal/60 hover:bg-white/80"
                                }`}
                                onClick={() => handleInterestClick(id)}
                            >
                                {label}
                            </motion.div>
                        ))}

                        <AnimatePresence>
                            {[...selectedInterests]
                                .filter((interest) => !initialInterests.some(({ id }) => id === interest))
                                .map((custom) => (
                                    <motion.div
                                        key={custom}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="relative px-5 py-3 bg-charcoal border border-charcoal text-white rounded-2xl text-sm font-semibold cursor-pointer shadow-md pr-9"
                                    >
                                        {custom}
                                        <button
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full w-5 h-5 flex items-center justify-center border border-white/20 cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleInterestClick(custom);
                                            }}
                                        >
                                            <X className="w-2.5 h-2.5" />
                                        </button>
                                    </motion.div>
                                ))}
                        </AnimatePresence>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-10">
                        <input
                            type="text"
                            value={customInterest}
                            onChange={(e) => setCustomInterest(e.target.value)}
                            placeholder="Add custom interest"
                            className="px-4 py-3 bg-white border border-cream-dark/80 rounded-2xl text-charcoal placeholder-charcoal/30 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none w-full max-w-xs text-sm font-medium"
                        />
                        <button
                            onClick={addCustomInterest}
                            className="px-6 py-3 bg-charcoal hover:bg-black rounded-full text-white text-sm font-semibold shadow-md cursor-pointer transition-all w-full sm:w-auto"
                        >
                            Add Custom
                        </button>
                    </div>

                    <button
                        onClick={() => setShowBucketList(true)}
                        className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-sm font-semibold shadow-lg hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                    >
                        <span>Continue to Bucket List</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                </div>
            ) : (
                <AnimatePresence mode="wait">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.6 }}
                        className="w-full"
                    >
                        <BucketList userInterests={Array.from(selectedInterests)} />
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
}
