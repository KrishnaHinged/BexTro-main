"use client";

import React, { useState } from "react";
import CommunityCard from "./CommunityCard";
import EmptyState from "@/components/ui/EmptyState";
import { FaUsers } from "react-icons/fa";

export default function CommunitiesList({
  communities = [],
  myCommunities = [],
  onJoin,
  onOpenChat
}) {
  const [activeSubTab, setActiveSubTab] = useState("explore");
  const displayList = activeSubTab === "explore" ? communities : myCommunities;
  const myCommunityIds = new Set(myCommunities.map((c) => c._id));

  return (
    <div className="bg-cream border-t border-cream-dark/60 pt-4">
      {/* Sub tabs */}
      <div className="flex gap-6 border-b border-cream-dark/60 mb-8 pb-4">
        <button
          type="button"
          onClick={() => setActiveSubTab("explore")}
          className={`pb-2 text-sm font-semibold px-1 transition cursor-pointer bg-transparent border-none outline-none ${
            activeSubTab === "explore"
              ? "text-charcoal border-b-2 border-charcoal font-bold font-serif-elegant"
              : "text-charcoal/40 hover:text-charcoal"
          }`}
        >
          Explore Public
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab("mine")}
          className={`pb-2 text-sm font-semibold px-1 transition cursor-pointer bg-transparent border-none outline-none ${
            activeSubTab === "mine"
              ? "text-charcoal border-b-2 border-charcoal font-bold font-serif-elegant"
              : "text-charcoal/40 hover:text-charcoal"
          }`}
        >
          My Communities ({myCommunities.length})
        </button>
      </div>

      {displayList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayList.map((community) => (
            <CommunityCard
              key={community._id}
              community={community}
              isJoined={myCommunityIds.has(community._id)}
              onJoin={onJoin}
              onOpenChat={onOpenChat}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<FaUsers />}
          title={
            activeSubTab === "explore"
              ? "No public communities found"
              : "You haven't joined any communities yet"
          }
          description={
            activeSubTab === "explore"
              ? "Be the first to create a community cohort around your craft!"
              : "Explore vibrant circles of builders, thinkers, and athletes."
          }
          actionLabel={activeSubTab === "mine" ? "Explore Communities" : undefined}
          onAction={activeSubTab === "mine" ? () => setActiveSubTab("explore") : undefined}
        />
      )}
    </div>
  );
}
