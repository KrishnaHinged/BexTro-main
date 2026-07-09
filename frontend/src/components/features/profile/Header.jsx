import React from "react";
import { ROOT_URL } from "../../../api/axios";

const Header = ({ user, connections }) => {
  const profilePhotoUrl = user.profilePhoto
    ? user.profilePhoto.startsWith("http")
      ? user.profilePhoto
      : `${ROOT_URL}${user.profilePhoto}`
    : `https://ui-avatars.com/api/?name=${user.username || "User"}`;

  return (
    <div className="bg-cream-card p-6 rounded-[2.5rem] border border-cream-dark/80 shadow-md font-sans-clean flex flex-col justify-between h-full min-h-[190px]">
      {/* TOP SECTION */}
      <div className="flex items-center gap-4">
        <img
          src={profilePhotoUrl}
          alt="Profile"
          className="w-14 h-14 rounded-2xl object-cover border border-cream-dark shadow-sm"
        />
        <div>
          <h1 className="text-xl font-serif-elegant font-normal text-charcoal leading-snug">
            {user.fullName}
          </h1>
          <p className="text-charcoal/50 text-xs font-semibold">@{user.username}</p>
        </div>
      </div>

      {/* BOTTOM STATS SECTION */}
      <div className="grid grid-cols-2 gap-4 border-t border-cream-dark/50 pt-4 mt-4">
        <div className="text-center">
          <div className="text-xl font-bold text-charcoal">
            {user.currentStreak || 0}
          </div>
          <div className="text-[10px] uppercase font-bold text-charcoal/40 tracking-wider mt-0.5">
            Streak 🔥
          </div>
        </div>

        <div className="text-center border-l border-cream-dark/50">
          <div className="text-xl font-bold text-charcoal">
            {connections?.length || 0}
          </div>
          <div className="text-[10px] uppercase font-bold text-charcoal/40 tracking-wider mt-0.5">
            Connections
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;