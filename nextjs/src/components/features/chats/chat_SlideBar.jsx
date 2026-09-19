"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOtherUser } from "@/redux/userSlice";
import toast from "react-hot-toast";
import OUsers from "./otherUsers";

export default function Chat_SlideBar() {
  const [search, setSearch] = useState("");
  const { OtherUsers } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const searchSubmitHandler = (e) => {
    e.preventDefault();
    if (!search.trim()) {
      dispatch(setOtherUser(OtherUsers));
      return;
    }

    const searchTerm = search.toLowerCase().trim();
    const filteredUsers = OtherUsers?.filter((user) =>
      user.fullName.toLowerCase().includes(searchTerm)
    );

    if (filteredUsers?.length > 0) {
      dispatch(setOtherUser(filteredUsers));
    } else {
      toast.error("No users found matching your search");
      dispatch(setOtherUser(OtherUsers));
    }
    setSearch("");
  };

  return (
    <div className="flex flex-col h-full p-4 bg-cream-card text-charcoal font-sans-clean">
      <form onSubmit={searchSubmitHandler} className="flex items-center gap-3 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-3.5 bg-white border border-cream-dark/85 rounded-xl text-charcoal placeholder-charcoal/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-sm font-medium"
          placeholder="Search chats..."
        />
        <button
          type="submit"
          className="p-3 bg-charcoal text-white rounded-xl hover:bg-black transition-all cursor-pointer flex items-center justify-center border-none outline-none"
        >
          🔍
        </button>
      </form>
      <div className="border-t border-cream-dark/60 mb-4"></div>
      <div className="flex-1 overflow-y-auto">
        <OUsers />
      </div>
    </div>
  );
}
