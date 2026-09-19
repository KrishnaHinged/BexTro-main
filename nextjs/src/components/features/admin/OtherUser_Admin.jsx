"use client";

import React, { useState, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "@/redux/userSlice";
import { ROOT_URL } from "@/api/axios";

const OtherUser_Admin = ({ user }) => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((store) => store.user);
  const [activeTab, setActiveTab] = useState("interests");

  const selectedUserHandler = (user) => {
    dispatch(setSelectedUser(user));
  };

  const profilePhotoUrl = user?.profilePhoto?.startsWith("http")
    ? user.profilePhoto
    : user?.profilePhoto
    ? `${ROOT_URL}${user.profilePhoto}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || "User")}`;

  const interests = user?.interests || [];
  const bucketList = user?.bucketList || [];

  return (
    <div className="bg-white border border-cream-dark/80 rounded-[2rem] p-6 flex flex-col transition-all duration-300 hover:shadow-lg group">
      {/* Profile Section */}
      <div
        onClick={() => selectedUserHandler(user)}
        className="flex items-center gap-4 cursor-pointer mb-6"
      >
        <div className="relative">
          <img
            className="w-14 h-14 rounded-2xl border border-cream-dark object-cover shadow-sm transition-transform duration-300 group-hover:scale-105"
            src={profilePhotoUrl}
            alt={`${user?.fullName || "User"}'s profile`}
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || "User")}`;
            }}
          />
          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
        </div>
        <div className="flex-1">
          <h4 className="text-base font-bold text-charcoal tracking-tight leading-tight">
            {user?.fullName || "Unknown User"}
          </h4>
          <div className="flex flex-col gap-0.5 mt-1">
            <p className="text-charcoal/40 text-[10px] font-bold uppercase tracking-wider">
              @{user?.username} • Joined {user?.createdAt?.substring(0, 10) || "N/A"}
            </p>
            <p className="text-indigo-600 text-xs font-bold">
              Role: <span className="uppercase">{user?.role || "user"}</span> • Score: {user?.score !== undefined ? user.score : 0}
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 bg-cream rounded-xl mb-4 border border-cream-dark/60">
        <button
          className={`flex-1 py-1.5 font-bold text-[10px] uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
            activeTab === "interests"
              ? "bg-charcoal text-white shadow-xs"
              : "text-charcoal/50 hover:text-charcoal"
          }`}
          onClick={() => setActiveTab("interests")}
        >
          Interests
        </button>
        <button
          className={`flex-1 py-1.5 font-bold text-[10px] uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
            activeTab === "bucketlist"
              ? "bg-charcoal text-white shadow-xs"
              : "text-charcoal/50 hover:text-charcoal"
          }`}
          onClick={() => setActiveTab("bucketlist")}
        >
          Bucket List
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto max-h-40 scroll-smooth pr-1">
        {activeTab === "interests" && (
          <div className="space-y-2">
            {interests.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {interests.map((interest, index) => (
                  <span
                    key={index}
                    className="bg-cream text-charcoal/80 border border-cream-dark/80 px-2.5 py-1 rounded-lg text-[10px] font-semibold"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-charcoal/40 text-center text-xs italic py-4">No interests documented.</p>
            )}
          </div>
        )}

        {activeTab === "bucketlist" && (
          <div className="space-y-1.5">
            {bucketList.length > 0 ? (
              <ul className="space-y-1.5">
                {bucketList.map((item, index) => (
                  <li
                    key={index}
                    className={`flex items-center gap-2 p-2 rounded-lg border border-cream-dark/60 ${
                      item.achieved ? "bg-emerald-50/50 opacity-70" : "bg-cream/40"
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded border ${
                        item.achieved ? "bg-emerald-600 border-emerald-600" : "border-charcoal/30"
                      } flex items-center justify-center transition-all flex-shrink-0 text-white text-[9px]`}
                    >
                      {item.achieved && "✓"}
                    </div>
                    <span className={`text-[11px] font-medium ${item.achieved ? "text-charcoal/40 line-through" : "text-charcoal/80"}`}>
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-charcoal/40 text-center text-xs italic py-4">
                No items in bucket list.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Moderation Actions */}
      <div className="mt-4 pt-4 border-t border-cream-dark/60 flex gap-2">
         <button 
           onClick={() => user.role === 'admin' ? window.onUpdateRole && window.onUpdateRole(user._id, 'user') : window.onUpdateRole && window.onUpdateRole(user._id, 'admin')}
           className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer
            ${user.role === 'admin' ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100' : 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100'}`}
         >
           {user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
         </button>
         <button 
           onClick={() => window.onDeleteUser && window.onDeleteUser(user._id)}
           className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold uppercase tracking-wider hover:bg-rose-100 transition-all cursor-pointer"
         >
           Delete
         </button>
      </div>
    </div>
  );
};

export default memo(OtherUser_Admin);
