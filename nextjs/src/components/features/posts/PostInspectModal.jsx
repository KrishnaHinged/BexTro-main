"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaRegHeart, FaTimes, FaExternalLinkAlt, FaCheckCircle } from 'react-icons/fa';
import { ROOT_URL } from '@/api/axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const PostInspectModal = ({ post, isOpen, onClose, onLike, isLiked, likesCount, onFollow, followStatus }) => {
    const router = useRouter();
    if (!isOpen || !post) return null;

    const profilePhotoUrl = post.user?.profilePhoto?.startsWith("http")
        ? post.user.profilePhoto
        : post.user?.profilePhoto
            ? `${ROOT_URL}${post.user.profilePhoto}`
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(post.user?.username || "User")}`;

    const mediaUrl = post.proofUrl?.startsWith("http") ? post.proofUrl : `${ROOT_URL}${post.proofUrl}`;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-[120] bg-dark-green/90 backdrop-blur-md flex items-center justify-center p-4 font-sans-clean"
            >
                <motion.div
                    initial={{ scale: 0.95, y: 15 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 15 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-cream-card border border-cream-dark/80 rounded-[2.5rem] max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row relative"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-20 w-9 h-9 bg-white/90 hover:bg-white text-charcoal rounded-full flex items-center justify-center shadow-md cursor-pointer transition"
                    >
                        <FaTimes size={14} />
                    </button>

                    {/* Left: Media Area */}
                    <div className="md:w-3/5 bg-black/95 flex items-center justify-center min-h-[300px] md:min-h-[500px] max-h-[500px] md:max-h-[600px] overflow-hidden relative">
                        {post.proofType === "image" && (
                            <img
                                src={mediaUrl}
                                alt="Proof inspection"
                                className="w-full h-full object-contain max-h-[500px]"
                            />
                        )}

                        {post.proofType === "video" && (
                            <video
                                src={mediaUrl}
                                controls
                                autoPlay
                                className="w-full h-full object-contain max-h-[500px]"
                            />
                        )}

                        {(post.proofType === "link" || post.proofType === "blog") && (
                            <div className="p-8 text-center space-y-4 text-white">
                                <FaExternalLinkAlt size={36} className="mx-auto text-indigo-400" />
                                <h3 className="text-xl font-bold font-serif-elegant">{post.challengeText}</h3>
                                <a
                                    href={post.proofUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-full shadow-lg transition"
                                >
                                    <span>Open Verified Proof Link</span>
                                    <FaExternalLinkAlt size={10} />
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Right: Details, User, & Engagement */}
                    <div className="md:w-2/5 p-6 md:p-8 flex flex-col justify-between overflow-y-auto bg-cream-card">
                        <div className="space-y-6">
                            {/* Author Row */}
                            <div className="flex items-center justify-between border-b border-cream-dark/60 pb-4 pr-8">
                                <div
                                    onClick={() => {
                                        onClose();
                                        router.push(`/user/${post.user?._id}`);
                                    }}
                                    className="flex items-center gap-3 cursor-pointer group"
                                >
                                    <img
                                        src={profilePhotoUrl}
                                        alt={post.user?.fullName || "User"}
                                        className="w-11 h-11 rounded-full object-cover border border-cream-dark shadow-xs group-hover:scale-105 transition"
                                        onError={(e) => {
                                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.user?.username || "User")}`;
                                        }}
                                    />
                                    <div>
                                        <h4 className="text-sm font-bold text-charcoal group-hover:text-indigo-600 transition">
                                            {post.user?.fullName}
                                        </h4>
                                        <p className="text-[11px] text-charcoal/50 font-medium">@{post.user?.username}</p>
                                    </div>
                                </div>

                                {onFollow && (
                                    <button
                                        onClick={onFollow}
                                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer border ${
                                            followStatus === "following"
                                                ? "bg-cream border-cream-dark text-charcoal/70"
                                                : "bg-charcoal border-charcoal text-white hover:bg-black"
                                        }`}
                                    >
                                        {followStatus === "following" ? "Following" : "Follow"}
                                    </button>
                                )}
                            </div>

                            {/* Challenge Title */}
                            <div className="space-y-2">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 inline-flex items-center gap-1">
                                    <FaCheckCircle size={10} />
                                    <span>Verified Proof</span>
                                </span>
                                <h3 className="text-lg md:text-xl font-serif-elegant font-normal text-charcoal leading-snug">
                                    {post.challengeText}
                                </h3>
                                {post.description && (
                                    <p className="text-xs text-charcoal/70 leading-relaxed font-sans-clean pt-1">
                                        {post.description}
                                    </p>
                                )}
                            </div>

                            {/* Timestamp */}
                            <div className="text-[11px] text-charcoal/40 font-medium">
                                Documented on {new Date(post.createdAt || Date.now()).toLocaleDateString(undefined, {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric"
                                })}
                            </div>
                        </div>

                        {/* Bottom Actions */}
                        <div className="pt-6 border-t border-cream-dark/60 flex items-center justify-between">
                            <button
                                onClick={onLike}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-cream-dark/80 rounded-full shadow-xs hover:bg-cream/50 transition cursor-pointer"
                            >
                                {isLiked ? (
                                    <FaHeart className="text-rose-600 text-sm animate-bounce" />
                                ) : (
                                    <FaRegHeart className="text-charcoal/70 text-sm" />
                                )}
                                <span className="text-xs font-bold text-charcoal">{likesCount}</span>
                            </button>

                            <button
                                onClick={async () => {
                                    if (typeof window !== "undefined") {
                                        const shareData = {
                                            title: `Proof: ${post.challengeText}`,
                                            text: `Check out ${post.user?.fullName}'s verified proof on Bextro: "${post.challengeText}"`,
                                            url: window.location.href
                                        };

                                        if (navigator.share) {
                                            try {
                                                await navigator.share(shareData);
                                            } catch (err) {
                                                if (err.name !== 'AbortError') {
                                                    navigator.clipboard.writeText(mediaUrl);
                                                    toast.success("Proof link copied to clipboard!");
                                                }
                                            }
                                        } else {
                                            navigator.clipboard.writeText(mediaUrl);
                                            toast.success("Proof link copied to clipboard!");
                                        }
                                    }
                                }}
                                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full border border-indigo-200 shadow-xs transition cursor-pointer"
                            >
                                <FaExternalLinkAlt size={10} />
                                <span>Share Proof</span>
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default PostInspectModal;
