"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ChallengesSection({
  acceptedChallenges,
  completedPosts,
  onRequestProof,
  onDrop,
  onToggleVisibility,
  actionLoading,
}) {
  const [subTab, setSubTab] = useState("ongoing");
  const ongoingChallenges = acceptedChallenges.filter((c) => c.status === "active");

  return (
    <div className="space-y-6 font-sans-clean">
      {/* Sub-tabs */}
      <div className="flex gap-6 border-b border-cream-dark/60 pb-4">
        <button
          className={`pb-2 text-sm font-semibold px-1 cursor-pointer transition bg-transparent border-none outline-none ${
            subTab === "ongoing" 
              ? "text-charcoal border-b-2 border-charcoal font-bold" 
              : "text-charcoal/40 hover:text-charcoal"
          }`}
          onClick={() => setSubTab("ongoing")}
        >
          Ongoing ({ongoingChallenges.length})
        </button>
        <button
          className={`pb-2 text-sm font-semibold px-1 cursor-pointer transition bg-transparent border-none outline-none ${
            subTab === "completed" 
              ? "text-charcoal border-b-2 border-charcoal font-bold" 
              : "text-charcoal/40 hover:text-charcoal"
          }`}
          onClick={() => setSubTab("completed")}
        >
          Completed ({completedPosts.length})
        </button>
      </div>

      {subTab === "ongoing" ? (
        <div className="grid gap-4">
          {ongoingChallenges.map((challenge, index) => {
            const elapsed = Math.floor(
              (Date.now() - new Date(challenge.acceptedAt)) / (1000 * 60 * 60 * 24)
            );
            const daysLeft = Math.max(0, challenge.timelineDays - elapsed);
            const progress = Math.min(
              100,
              (elapsed / challenge.timelineDays) * 100
            );

            return (
              <div
                key={index}
                className="bg-cream-card rounded-3xl p-6 border border-cream-dark/80 shadow-md"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-5">
                  <div>
                    <h3 className="text-lg sm:text-xl font-serif-elegant font-normal text-charcoal mb-2">
                      {challenge.challengeText}
                    </h3>
                    <p className="text-charcoal/50 text-xs font-semibold">
                      Started: {new Date(challenge.acceptedAt).toLocaleDateString()}
                    </p>
                    <p className="text-indigo-600 text-xs font-bold mt-1">
                      Timeline: {challenge.timelineDays} days
                    </p>
                  </div>
                  <div className="text-right sm:self-center">
                    <span className="text-sm font-bold bg-indigo-50 border border-indigo-100/50 text-indigo-700 px-3 py-1.5 rounded-xl">
                      {daysLeft} days left
                    </span>
                  </div>
                </div>

                <div className="w-full bg-cream border border-cream-dark/60 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => onRequestProof(challenge)}
                    disabled={actionLoading}
                    className="bg-charcoal hover:bg-black disabled:bg-charcoal/50 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-sm transition cursor-pointer border-none outline-none"
                  >
                    Submit Proof
                  </button>
                  <button
                    onClick={() => onDrop(challenge.challengeText)}
                    disabled={actionLoading}
                    className="border border-charcoal/20 hover:bg-charcoal/5 disabled:opacity-50 text-charcoal text-xs font-semibold px-5 py-2.5 rounded-xl transition cursor-pointer bg-transparent"
                  >
                    Drop
                  </button>
                </div>
              </div>
            );
          })}

          {ongoingChallenges.length === 0 && (
            <div className="text-center text-charcoal/40 py-12 text-sm font-medium">
              No ongoing challenges. Start a new one!
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {completedPosts.map((post) => (
            <div
              key={post._id}
              className="bg-cream-card rounded-3xl p-6 border border-cream-dark/80 shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
                    <h3 className="text-base sm:text-lg font-serif-elegant font-normal text-charcoal">
                      {post.challengeText}
                    </h3>
                    
                    {/* Toggle Button */}
                    <button
                      onClick={() => onToggleVisibility(post._id, post.visibility)}
                      className="relative w-[110px] h-[30px] rounded-full border border-cream-dark/80 bg-cream flex items-center px-1 transition-all duration-300 active:scale-95 cursor-pointer outline-none"
                    >
                      <div
                        className={`absolute inset-0 rounded-full transition-all duration-500 ${
                          post.visibility !== "private"
                            ? "bg-indigo-50 border border-indigo-100"
                            : "bg-cream-card"
                        }`}
                      />

                      {/* Sliding Knob */}
                      <motion.div
                        layout
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className={`relative z-10 w-1/2 h-[22px] rounded-full flex items-center justify-center text-[9px] font-bold uppercase tracking-wider ${
                          post.visibility !== "private"
                            ? "ml-auto bg-indigo-600 text-white"
                            : "bg-charcoal text-white"
                        }`}
                      >
                        {post.visibility !== "private" ? "Public" : "Only Me"}
                      </motion.div>

                      <div className="absolute inset-0 flex justify-between items-center px-3 text-[8px] font-semibold uppercase tracking-wider text-charcoal/20 select-none">
                        <span>Private</span>
                        <span>Public</span>
                      </div>
                    </button>
                  </div>

                  <p className="text-charcoal/40 text-xs font-semibold mb-4">
                    Completed on {new Date(post.createdAt).toLocaleDateString()}
                  </p>

                  {post.description && (
                    <p className="text-charcoal/70 text-sm italic bg-white border border-cream-dark/60 p-4 rounded-2xl mb-4">
                      "{post.description}"
                    </p>
                  )}

                  {post.proofType === "image" && (
                    <img
                      src={post.proofUrl}
                      alt="Proof"
                      className="w-full max-w-md h-48 object-cover rounded-2xl border border-cream-dark/80 shadow-sm"
                    />
                  )}
                  {post.proofType === "video" && (
                    <video
                      controls
                      src={post.proofUrl}
                      className="w-full max-w-md h-48 rounded-2xl border border-cream-dark/80 shadow-sm"
                    />
                  )}
                  {post.proofType === "link" && (
                    <a
                      href={post.proofUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block bg-charcoal hover:bg-black text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-sm transition"
                    >
                      View Proof Link
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}

          {completedPosts.length === 0 && (
            <div className="text-center text-charcoal/40 py-12 text-sm font-medium">
              No completed challenges yet. Keep pushing!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
