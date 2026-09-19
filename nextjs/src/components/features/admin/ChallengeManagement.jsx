"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/api/axios";
import { toast } from "react-hot-toast";
import { FaTrash, FaPlus } from "react-icons/fa";

const ChallengeManagement = () => {
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [formData, setFormData] = useState({
        text: "",
        objective: "",
        motivation: "",
        category: "General",
        difficulty: "Medium"
    });

    const fetchChallenges = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/admin/challenges");
            setChallenges(res.data.challenges || []);
        } catch (error) {
            console.error("Admin fetch challenges error:", error);
            toast.error("Failed to load challenges");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChallenges();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this challenge?")) return;
        try {
            await axiosInstance.delete(`/admin/challenges/${id}`);
            toast.success("Challenge deleted");
            setChallenges(prev => prev.filter(c => c._id !== id));
        } catch (error) {
            console.error("Delete challenge error:", error);
            toast.error("Failed to delete challenge");
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!formData.text.trim()) return;
        try {
            await axiosInstance.post("/admin/challenges", formData);
            toast.success("Curated challenge created!");
            setShowCreate(false);
            setFormData({
                text: "",
                objective: "",
                motivation: "",
                category: "General",
                difficulty: "Medium"
            });
            fetchChallenges();
        } catch (error) {
            console.error("Create challenge error:", error);
            toast.error("Failed to create challenge");
        }
    };

    if (loading) {
        return (
            <div className="py-20 text-center text-charcoal/50">
                <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-xs font-medium">Loading platform challenges...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-serif-elegant font-normal text-charcoal">
                        Challenges & Drills Management
                    </h2>
                    <p className="text-xs text-charcoal/50 mt-0.5">
                        Manage global curated challenges ({challenges.length} active)
                    </p>
                </div>

                <button
                    onClick={() => setShowCreate(!showCreate)}
                    className="px-5 py-2.5 bg-charcoal hover:bg-black text-white text-xs font-bold rounded-full shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                    <FaPlus size={10} />
                    <span>{showCreate ? "Cancel" : "Add Challenge"}</span>
                </button>
            </div>

            {/* Create Challenge Form */}
            {showCreate && (
                <form onSubmit={handleCreate} className="p-6 bg-white border border-cream-dark/80 rounded-3xl space-y-4 shadow-sm">
                    <h3 className="text-sm font-bold text-charcoal">Create Curated Growth Challenge</h3>
                    
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-charcoal/60">Challenge Action Statement</label>
                        <input
                            type="text"
                            required
                            value={formData.text}
                            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                            placeholder="e.g. Code for 60 minutes without checking social media"
                            className="w-full px-4 py-2.5 bg-cream/40 border border-cream-dark/80 rounded-xl text-xs text-charcoal outline-none focus:border-indigo-600"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-bold text-charcoal/60">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2.5 bg-cream/40 border border-cream-dark/80 rounded-xl text-xs text-charcoal outline-none"
                            >
                                {["General", "Personal", "Professional", "Adventure", "Creative", "Health", "Learning"].map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-charcoal/60">Difficulty</label>
                            <select
                                value={formData.difficulty}
                                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                className="w-full px-4 py-2.5 bg-cream/40 border border-cream-dark/80 rounded-xl text-xs text-charcoal outline-none"
                            >
                                {["Easy", "Medium", "Hard"].map(d => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-full shadow-sm transition cursor-pointer"
                    >
                        Publish Challenge
                    </button>
                </form>
            )}

            {/* Challenges List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {challenges.map((challenge) => (
                    <div
                        key={challenge._id}
                        className="p-5 bg-white border border-cream-dark/80 rounded-2xl shadow-xs space-y-3 flex flex-col justify-between"
                    >
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                    {challenge.category} • {challenge.difficulty}
                                </span>
                                <span className="text-[10px] font-bold text-charcoal/40">
                                    Source: {challenge.source}
                                </span>
                            </div>
                            <h4 className="text-sm font-bold text-charcoal leading-snug">
                                {challenge.text}
                            </h4>
                        </div>

                        <div className="pt-2 flex justify-between items-center border-t border-cream-dark/50 text-[11px] text-charcoal/50">
                            <span>Completed: {challenge.completedByCount || 0} times</span>
                            <button
                                onClick={() => handleDelete(challenge._id)}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer flex items-center gap-1 font-bold text-[11px]"
                            >
                                <FaTrash size={10} />
                                <span>Delete</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChallengeManagement;
