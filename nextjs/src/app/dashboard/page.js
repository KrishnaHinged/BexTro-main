"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/api/axios";
import { motion, AnimatePresence } from "framer-motion";
import MainSlideBar from "@/components/layout/MainSlideBar";
import DailyQuotes from "@/components/features/dashboard_tab/dailyQuotes";
import Profile from "@/components/features/dashboard_tab/profile";
import Startup from "@/components/features/dashboard_tab/startup";
import PageLoader from "@/components/common/loaders/pagesLoader";

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [step, setStep] = useState(1);
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    useEffect(() => {
        const stepTimer = setTimeout(() => setStep(2), 2000);

        const fetchUser = async () => {
            try {
                const res = await axiosInstance.get("/user/profile");
                setUser(res.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUser();

        return () => clearTimeout(stepTimer);
    }, [refetchTrigger]);

    const handleChallengeAction = () => {
        setRefetchTrigger(prev => prev + 1);
    };

    return (
        <div className="flex min-h-screen bg-cream text-charcoal font-sans-clean">
            <MainSlideBar />

            <div className="flex-1 p-6 md:p-10 overflow-y-auto">
                <AnimatePresence>
                    {step === 1 && <PageLoader message="Preparing your dashboard..." />}
                </AnimatePresence>

                {step === 2 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-3xl md:text-5xl font-serif-elegant font-normal text-charcoal mb-10">
                            {user ? `Welcome back, ${user.fullName.split(' ')[0]}` : "Welcome"}
                            <span className="text-indigo-600">.</span>
                        </h1>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1">
                                <Profile refetchTrigger={refetchTrigger} />
                            </div>

                            <div className="lg:col-span-2 space-y-8">
                                <DailyQuotes />
                                <Startup onChallengeAction={handleChallengeAction} />
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
