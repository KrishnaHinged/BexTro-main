"use client";

import React, { useState, useEffect } from 'react';
import axiosInstance from '@/api/axios';
import { motion } from 'framer-motion';
import { FaCheck, FaTrash, FaUser, FaFileAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const ReportManagement = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const res = await axiosInstance.get("/report");
            setReports(res.data || []);
            setLoading(false);
        } catch (error) {
            console.error("Fetch reports error:", error);
            setLoading(false);
        }
    };

    const handleAction = async (reportId, status) => {
        try {
            await axiosInstance.patch(`/report/${reportId}`, { status });
            toast.success(`Report ${status} successfully.`);
            fetchReports();
        } catch (error) {
            toast.error("Action failed.");
        }
    };

    if (loading) return <div className="p-10 text-charcoal/50 text-center">Loading reports...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-serif-elegant font-normal text-charcoal">
                    Moderation & Reports
                </h2>
                <p className="text-xs text-charcoal/50 mt-0.5">
                    User reports and content moderation flags
                </p>
            </div>

            <div className="space-y-3">
                {reports.length === 0 ? (
                    <div className="bg-white border border-cream-dark/80 p-10 rounded-3xl text-center text-charcoal/50">
                        No pending reports. The community is behaving well! 🎉
                    </div>
                ) : null}
                {reports.map((report) => (
                    <motion.div
                        key={report._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white border border-cream-dark/80 p-5 rounded-2xl flex items-center justify-between gap-6 shadow-xs"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${report.targetType === 'Post' ? 'bg-indigo-50 text-indigo-600' : 'bg-pink-50 text-pink-600'}`}>
                                {report.targetType === 'Post' ? <FaFileAlt /> : <FaUser />}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold text-charcoal uppercase tracking-wider">{report.targetType} Report</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${report.status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
                                        {report.status}
                                    </span>
                                </div>
                                <p className="text-charcoal font-bold text-sm">{report.reason}</p>
                                <p className="text-charcoal/60 text-xs italic mt-1">"{report.description}"</p>
                                <p className="text-charcoal/40 text-[10px] mt-2">
                                    Reported by <span className="text-indigo-600 font-bold">@{report.reporter?.username}</span> • {new Date(report.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            {report.status === 'pending' && (
                                <>
                                    <button 
                                        onClick={() => handleAction(report._id, 'resolved')}
                                        className="p-2.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-xl transition-all cursor-pointer"
                                        title="Mark as Resolved"
                                    >
                                        <FaCheck size={14} />
                                    </button>
                                    <button 
                                        onClick={() => handleAction(report._id, 'dismissed')}
                                        className="p-2.5 bg-cream text-charcoal/60 hover:bg-cream-dark/60 rounded-xl transition-all cursor-pointer"
                                        title="Dismiss Report"
                                    >
                                        <FaTrash size={14} />
                                    </button>
                                </>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ReportManagement;
