"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "@/api/axios";
import { toast } from "react-hot-toast";
import { 
    FaTimes, 
    FaUpload, 
    FaLink, 
    FaFileAlt, 
    FaCheckCircle, 
    FaShareAlt
} from "react-icons/fa";

const MilestoneProofModal = ({ goal, milestone, onClose, onProofSubmitted }) => {
    const [proofType, setProofType] = useState("image"); // "image" | "video" | "link" | "text"
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [proofUrl, setProofUrl] = useState("");
    const [proofText, setProofText] = useState(milestone?.keyDeliverable || "");
    const [reflection, setReflection] = useState("");
    const [shareToFeed, setShareToFeed] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
            if (selectedFile.type.startsWith("video")) {
                setProofType("video");
            } else {
                setProofType("image");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("proofType", proofType);
            formData.append("proofText", proofText);
            formData.append("reflection", reflection);
            formData.append("shareToFeed", shareToFeed);

            if (file) {
                formData.append("proofFile", file);
            } else if (proofUrl) {
                formData.append("proofUrl", proofUrl);
            }

            const res = await axiosInstance.post(
                `/goals/${goal._id}/milestones/${milestone._id}/proof`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            toast.success("Milestone achieved & proof documented! (+75 XP)");
            if (onProofSubmitted) {
                onProofSubmitted(res.data.goal);
            }
            onClose();
        } catch (error) {
            console.error("Submit milestone proof error:", error);
            toast.error(error.response?.data?.error || "Failed to submit proof");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-dark-green/90 backdrop-blur-md z-[120] flex items-center justify-center p-4 font-sans-clean"
            >
                <motion.div
                    initial={{ scale: 0.95, y: 15 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 15 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-cream-card border border-cream-dark/80 rounded-[2.8rem] max-w-xl w-full p-8 sm:p-10 shadow-2xl text-charcoal relative max-h-[90vh] overflow-y-auto space-y-6"
                >
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1.5">
                                <FaCheckCircle size={10} className="text-emerald-600" />
                                <span>Verify Milestone Deliverable</span>
                            </span>
                            <h2 className="text-2xl font-serif-elegant font-normal text-charcoal">
                                {milestone?.title}
                            </h2>
                            <p className="text-xs text-charcoal/50">
                                Goal: <strong className="text-charcoal">{goal?.title}</strong>
                            </p>
                        </div>

                        <button
                            onClick={onClose}
                            className="text-charcoal/40 hover:text-charcoal text-sm p-1 cursor-pointer transition"
                        >
                            <FaTimes size={14} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Proof Format Tabs */}
                        <div className="grid grid-cols-3 gap-2 bg-cream p-1.5 rounded-2xl border border-cream-dark/80">
                            <button
                                type="button"
                                onClick={() => setProofType("image")}
                                className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                                    proofType === "image" || proofType === "video"
                                        ? "bg-charcoal text-white shadow-xs"
                                        : "text-charcoal/60 hover:text-charcoal"
                                }`}
                            >
                                <FaUpload size={10} />
                                <span>Upload File</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setProofType("link")}
                                className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                                    proofType === "link"
                                        ? "bg-charcoal text-white shadow-xs"
                                        : "text-charcoal/60 hover:text-charcoal"
                                }`}
                            >
                                <FaLink size={10} />
                                <span>URL Link</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setProofType("text")}
                                className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                                    proofType === "text"
                                        ? "bg-charcoal text-white shadow-xs"
                                        : "text-charcoal/60 hover:text-charcoal"
                                }`}
                            >
                                <FaFileAlt size={10} />
                                <span>Notes Only</span>
                            </button>
                        </div>

                        {/* File Upload Area */}
                        {(proofType === "image" || proofType === "video") && (
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-charcoal/60">Upload Proof Screenshot / Media</label>
                                <div className="border-2 border-dashed border-cream-dark hover:border-charcoal/40 rounded-2xl p-6 text-center bg-white cursor-pointer relative transition">
                                    <input
                                        type="file"
                                        accept="image/*,video/*"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                    />
                                    {previewUrl ? (
                                        <div className="space-y-2">
                                            {proofType === "video" ? (
                                                <video src={previewUrl} className="max-h-44 mx-auto rounded-xl" controls />
                                            ) : (
                                                <img src={previewUrl} alt="Preview" className="max-h-44 mx-auto rounded-xl object-contain shadow-xs" />
                                            )}
                                            <p className="text-[11px] text-indigo-600 font-bold">Click or drag to change file</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <FaUpload size={24} className="mx-auto text-charcoal/30" />
                                            <p className="text-xs font-bold text-charcoal/80">Click to upload screenshot, output, or demo video</p>
                                            <p className="text-[10px] text-charcoal/40">PNG, JPG, MP4 up to 50MB</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Link Input */}
                        {proofType === "link" && (
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-charcoal/60">Proof URL (GitHub Repo, Live Demo, Article, Certificate)</label>
                                <div className="relative">
                                    <FaLink className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40 text-xs" />
                                    <input
                                        type="url"
                                        required
                                        value={proofUrl}
                                        onChange={(e) => setProofUrl(e.target.value)}
                                        placeholder="https://github.com/your-username/project or https://your-site.com"
                                        className="w-full pl-9 pr-4 py-3 bg-white border border-cream-dark/80 rounded-2xl text-xs text-charcoal outline-none focus:border-indigo-600 shadow-xs font-medium"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Deliverable Summary */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-charcoal/60">Deliverable Summary & Notes</label>
                            <input
                                type="text"
                                required
                                value={proofText}
                                onChange={(e) => setProofText(e.target.value)}
                                placeholder="e.g. Completed authentication middleware with JWT and rate limiting"
                                className="w-full px-4 py-3 bg-white border border-cream-dark/80 rounded-2xl text-xs text-charcoal outline-none focus:border-indigo-600 shadow-xs font-medium"
                            />
                        </div>

                        {/* Reflection / What was learned */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-charcoal/60">Key Reflection (Optional)</label>
                            <textarea
                                rows={2}
                                value={reflection}
                                onChange={(e) => setReflection(e.target.value)}
                                placeholder="What was the hardest part? What is the main insight to carry to the next mountain?"
                                className="w-full px-4 py-2.5 bg-white border border-cream-dark/80 rounded-2xl text-xs text-charcoal outline-none focus:border-indigo-600 shadow-xs resize-none"
                            />
                        </div>

                        {/* Share to Community Feed Toggle */}
                        <div className="p-4 bg-white border border-cream-dark/80 rounded-2xl flex items-center justify-between shadow-xs">
                            <div className="space-y-0.5">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-charcoal">
                                    <FaShareAlt size={10} className="text-indigo-600" />
                                    <span>Share to Community Proof Feed</span>
                                </div>
                                <p className="text-[10px] text-charcoal/50">
                                    Allow other builders to inspect and verify your work in the public feed.
                                </p>
                            </div>
                            <input
                                type="checkbox"
                                checked={shareToFeed}
                                onChange={(e) => setShareToFeed(e.target.checked)}
                                className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-charcoal hover:bg-black text-white text-xs font-bold rounded-full shadow-lg transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <FaCheckCircle size={12} />
                                    <span>Verify & Complete Milestone (+75 XP)</span>
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default MilestoneProofModal;
