"use client";

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FaChartLine, FaChartPie } from 'react-icons/fa';
import axiosInstance from '@/api/axios';

const Analytics = () => {
    const { authUser, role, onlineUsers, OtherUsers } = useSelector((state) => state.user);
    const [analyticsData, setAnalyticsData] = useState(null);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await axiosInstance.get(`/admin/stats`);
                setAnalyticsData(response.data);
            } catch (error) {
                console.error('Error fetching analytics:', error);
            }
        };

        if (role === 'admin') {
            fetchAnalytics();
        }
    }, [role]);

    const stats = {
        users: {
            total: analyticsData?.users || OtherUsers?.length || 0,
            active: onlineUsers?.length || 0,
        },
        proofs: analyticsData?.posts || 0,
        goals: analyticsData?.totalGoals || 0,
    };

    if (role !== 'admin') {
        return (
            <div className="p-6 h-full flex items-center justify-center">
                <p className="text-xl text-charcoal/60">
                    Access restricted to administrators only
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-center"
            >
                <div>
                    <h2 className="text-2xl font-serif-elegant font-normal text-charcoal">
                        Platform Analytics
                    </h2>
                    <p className="text-xs text-charcoal/50 mt-0.5">
                        Real-time behavioral telemetry and system usage
                    </p>
                </div>
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
                <motion.div
                    variants={itemVariants}
                    className="p-6 rounded-3xl bg-white border border-cream-dark/80 shadow-xs"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <FaChartLine className="text-2xl text-indigo-600" />
                        <h3 className="text-sm font-bold text-charcoal">
                            Online Status
                        </h3>
                    </div>
                    <div className="space-y-2 text-xs text-charcoal/70">
                        <p>Online Now: <span className="font-bold text-charcoal">{onlineUsers?.length || 0}</span></p>
                        <p>Total Registered: <span className="font-bold text-charcoal">{stats.users.total}</span></p>
                        <p>Admin Session: <span className="font-bold text-emerald-600">Active</span></p>
                    </div>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="p-6 rounded-3xl bg-white border border-cream-dark/80 shadow-xs"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <FaChartPie className="text-2xl text-emerald-600" />
                        <h3 className="text-sm font-bold text-charcoal">
                            Proof Execution
                        </h3>
                    </div>
                    <div className="space-y-2 text-xs text-charcoal/70">
                        <p>Verified Proofs: <span className="font-bold text-charcoal">{stats.proofs}</span></p>
                        <p>Active Trajectories: <span className="font-bold text-charcoal">{stats.goals}</span></p>
                    </div>
                </motion.div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-3xl bg-white border border-cream-dark/80 shadow-xs"
            >
                <div className="flex items-center gap-3 mb-4">
                    <FaChartPie className="text-2xl text-amber-600" />
                    <h3 className="text-sm font-bold text-charcoal">
                        System Overview
                    </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-charcoal/70">
                    <p>Current Admin: <span className="font-bold text-charcoal">@{authUser?.username || 'N/A'}</span></p>
                    <p>Total Users: <span className="font-bold text-charcoal">{stats.users.total.toLocaleString()}</span></p>
                    <p>Telemetry: <span className="font-bold text-emerald-600">Healthy & Synchronized</span></p>
                </div>
            </motion.div>
        </div>
    );
};

export default Analytics;
