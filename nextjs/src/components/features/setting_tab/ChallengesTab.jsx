"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import axiosInstance from "@/api/axios";

export default function ChallengesTab() {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await axiosInstance.get("/challenges/generate-challenges");
        setChallenges(response.data.challenges || []);
      } catch (error) {
        console.error("Error fetching challenges:", error);
        toast.error("Failed to load challenges!");
      }
    };
    fetchChallenges();
  }, []);

  const handleAcceptChallenge = async (challenge) => {
    try {
      await axiosInstance.post("/challenges/accept", { challenge: challenge.text });
      toast.success("Challenge accepted!");
    } catch (error) {
      console.error("Error accepting challenge:", error);
      toast.error("Failed to accept challenge!");
    }
  };

  return (
    <div className="font-sans-clean">
      <h2 className="text-xl font-serif-elegant font-normal text-charcoal mb-6">Generated Challenges</h2>
      <ul className="space-y-4">
        {challenges.map((challenge) => (
          <li
            key={challenge.text}
            className="p-6 bg-cream border border-cream-dark/60 rounded-3xl shadow-sm flex flex-col justify-between"
          >
            <div>
              <p className="text-base font-serif-elegant font-normal text-charcoal mb-3">{challenge.text}</p>
              <div className="space-y-2 mt-4">
                <p className="text-xs text-charcoal/70">
                  <strong className="text-charcoal font-semibold uppercase tracking-wider text-[10px] block mb-0.5">Objective</strong> 
                  {challenge.objective}
                </p>
                <p className="text-xs text-charcoal/70">
                  <strong className="text-charcoal font-semibold uppercase tracking-wider text-[10px] block mb-0.5">Motivation</strong> 
                  {challenge.motivation}
                </p>
                <p className="text-xs text-charcoal/70">
                  <strong className="text-charcoal font-semibold uppercase tracking-wider text-[10px] block mb-0.5">Benefits</strong> 
                  {challenge.benefits.join(", ")}
                </p>
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-cream-dark/50">
              <button
                onClick={() => handleAcceptChallenge(challenge)}
                className="px-5 py-2.5 bg-charcoal hover:bg-black text-white rounded-xl font-semibold text-xs transition cursor-pointer border-none outline-none"
              >
                Accept Challenge
              </button>
            </div>
          </li>
        ))}
        {challenges.length === 0 && (
          <p className="text-charcoal/40 text-xs italic font-medium">No challenges generated yet.</p>
        )}
      </ul>
    </div>
  );
}
