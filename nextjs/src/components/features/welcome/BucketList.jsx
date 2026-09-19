"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import axiosInstance from "@/api/axios";
import { toast } from "react-hot-toast";
import { getSuggestionsForInterests } from "@/utils/bucketListSuggestions";

export default function BucketList({ userInterests: propInterests }) {
  const [bucketList, setBucketList] = useState([]);
  const [interests, setInterests] = useState(propInterests || []);
  const [newItem, setNewItem] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Load existing bucket list
  useEffect(() => {
    axiosInstance
      .get("/userdata/bucket-list")
      .then((res) => {
        setBucketList(res.data.bucketList || []);
      })
      .catch((err) => {
        console.error("Error fetching bucket list:", err);
        // Silent or gentle notification to prevent blocking offline/initial loads
      });
  }, []);

  // If interests weren't passed as prop, load from user's profile
  useEffect(() => {
    if (!propInterests || propInterests.length === 0) {
      axiosInstance
        .get("/userdata/interests")
        .then((res) => {
          if (res.data?.interests?.length > 0) {
            setInterests(res.data.interests);
          }
        })
        .catch((err) => {
          console.error("Error fetching user interests:", err);
        });
    } else {
      setInterests(propInterests);
    }
  }, [propInterests]);

  // Compute suggestions strictly tailored to this user's interests (no cross-user data)
  const suggestedCategories = useMemo(() => {
    return getSuggestionsForInterests(interests);
  }, [interests]);

  const existingTexts = useMemo(() => {
    return new Set(bucketList.map((item) => item.text?.toLowerCase().trim()));
  }, [bucketList]);

  // Filtered suggestions based on active category tab
  const visibleSuggestions = useMemo(() => {
    if (activeCategory === "all") {
      const allItems = [];
      suggestedCategories.forEach((cat) => {
        cat.items.forEach((itemText) => {
          allItems.push({
            text: itemText,
            categoryLabel: cat.categoryLabel,
            icon: cat.icon
          });
        });
      });
      return allItems;
    }
    const found = suggestedCategories.find((c) => c.categoryKey === activeCategory);
    return (found?.items || []).map((itemText) => ({
      text: itemText,
      categoryLabel: found.categoryLabel,
      icon: found.icon
    }));
  }, [suggestedCategories, activeCategory]);

  const addSpecificItem = async (textToAdd) => {
    const trimmed = textToAdd.trim();
    if (!trimmed) return;

    if (existingTexts.has(trimmed.toLowerCase())) {
      toast("This goal is already in your bucket list!", { icon: "ℹ️" });
      return;
    }

    setIsSubmitting(true);
    const newItemObj = { text: trimmed, achieved: false };

    try {
      const res = await axiosInstance.post("/userdata/bucket-list", {
        action: "add",
        item: newItemObj
      });
      setBucketList(res.data.data || [...bucketList, newItemObj]);
      toast.success("Added to bucket list! 🎯");
    } catch (err) {
      console.error("Error adding item:", err);
      toast.error(err.response?.data?.error || "Failed to update bucket list");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addItem = () => {
    if (newItem.trim()) {
      addSpecificItem(newItem);
      setNewItem("");
    }
  };

  const removeItem = (text) => {
    axiosInstance
      .post("/userdata/bucket-list", { action: "remove", item: { text } })
      .then((res) => {
        setBucketList(res.data.data || bucketList.filter((i) => i.text !== text));
        toast.success("Goal removed from list");
      })
      .catch((err) => {
        console.error("Error removing item:", err);
        toast.error(err.response?.data?.error || "Failed to remove item");
      });
  };

  const toggleAchieved = (item) => {
    const updatedItem = { ...item, achieved: !item.achieved };
    axiosInstance
      .post("/userdata/bucket-list", { action: "update", item: updatedItem })
      .then((res) => {
        setBucketList(
          res.data.data ||
            bucketList.map((i) => (i.text === item.text ? updatedItem : i))
        );
        toast.success(updatedItem.achieved ? "Marked as achieved! 🏆" : "Marked as active");
      })
      .catch((err) => {
        console.error("Error updating item:", err);
        toast.error(err.response?.data?.error || "Failed to update item");
      });
  };

  const handleStartAchieving = () => {
    router.push("/set_challenges");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans-clean">
      <div className="max-w-3xl w-full p-6 sm:p-10 bg-cream-card border border-cream-dark/80 rounded-[2.5rem] shadow-xl text-center relative z-10">
        
        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-serif-elegant font-normal text-charcoal mb-2 tracking-tight">
          Your Bucket List
        </h1>
        <p className="text-xs sm:text-sm text-charcoal/60 mb-6">
          Because life&apos;s too short for regrets. Add, achieve, and repeat.
        </p>

        {/* Input Bar */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-6 max-w-xl mx-auto">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
            placeholder="Add a custom dream goal (e.g. Run Marathon)"
            className="px-4 py-3 bg-white border border-cream-dark/80 rounded-2xl text-charcoal placeholder-charcoal/35 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none w-full text-sm font-medium shadow-sm"
          />
          <button
            onClick={addItem}
            disabled={isSubmitting || !newItem.trim()}
            className="px-6 py-3 bg-charcoal hover:bg-black disabled:opacity-50 text-white text-sm font-semibold rounded-2xl sm:rounded-full shadow-md cursor-pointer transition-all w-full sm:w-auto flex-shrink-0"
          >
            Add Goal
          </button>
        </div>

        {/* Pre-Suggested Bucket List Section */}
        {suggestedCategories.length > 0 && (
          <div className="mb-8 p-5 bg-white/60 border border-cream-dark/70 rounded-3xl text-left shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-base">✨</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-charcoal/70">
                  Pre-Suggested For Your Focus Areas
                </span>
              </div>
              <span className="text-[11px] text-charcoal/40 font-medium">
                Click to add directly
              </span>
            </div>

            {/* Interest Filter Tabs */}
            {suggestedCategories.length > 1 && (
              <div className="flex flex-wrap gap-1.5 mb-3 pb-1 border-b border-cream-dark/40">
                <button
                  type="button"
                  onClick={() => setActiveCategory("all")}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeCategory === "all"
                      ? "bg-charcoal text-white shadow-xs"
                      : "bg-cream-dark/30 text-charcoal/60 hover:text-charcoal hover:bg-cream-dark/50"
                  }`}
                >
                  All Focuses
                </button>
                {suggestedCategories.map((cat) => (
                  <button
                    key={cat.categoryKey}
                    type="button"
                    onClick={() => setActiveCategory(cat.categoryKey)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                      activeCategory === cat.categoryKey
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-cream-dark/30 text-charcoal/60 hover:text-charcoal hover:bg-cream-dark/50"
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.categoryLabel}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Suggestion Chips Grid */}
            <div className="flex flex-wrap gap-2 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin">
              {visibleSuggestions.map((sug, idx) => {
                const isAdded = existingTexts.has(sug.text.toLowerCase().trim());
                return (
                  <motion.button
                    key={`${sug.text}-${idx}`}
                    whileHover={{ scale: isAdded ? 1 : 1.02 }}
                    whileTap={{ scale: isAdded ? 1 : 0.98 }}
                    disabled={isAdded || isSubmitting}
                    onClick={() => addSpecificItem(sug.text)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium border text-left flex items-center gap-2 transition-all cursor-pointer ${
                      isAdded
                        ? "bg-emerald-50/80 border-emerald-200 text-emerald-800 cursor-default opacity-85"
                        : "bg-white border-cream-dark/80 text-charcoal/85 hover:border-indigo-400 hover:bg-indigo-50/30 hover:text-indigo-900 shadow-xs"
                    }`}
                  >
                    <span className="text-xs">{sug.icon}</span>
                    <span className="truncate max-w-[240px] sm:max-w-[320px]">{sug.text}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isAdded ? "bg-emerald-100 text-emerald-700" : "bg-charcoal/5 text-charcoal/60"
                    }`}>
                      {isAdded ? "✓ Added" : "+ Add"}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* Current User's Active Bucket List */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal/70">
              Selected Goals ({bucketList.length})
            </span>
            {bucketList.length > 0 && (
              <span className="text-[11px] text-charcoal/50">
                {bucketList.filter((i) => i.achieved).length} achieved
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2.5 max-h-[220px] overflow-y-auto pr-2 scrollbar-thin">
            {bucketList.length === 0 ? (
              <div className="py-6 px-4 bg-white/40 border border-dashed border-cream-dark/80 rounded-2xl text-center">
                <p className="text-xs text-charcoal/50 font-medium">
                  No dream goals added yet. Select from the suggestions above or type your own!
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {bucketList.map((item, idx) => (
                  <motion.div
                    key={item._id || item.text || idx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`px-4 py-3 rounded-2xl border cursor-pointer transition-all duration-200 shadow-xs flex items-center justify-between gap-3 ${
                      item.achieved
                        ? "bg-indigo-50/50 border-indigo-200 text-indigo-950 font-medium"
                        : "bg-white border-cream-dark/70 text-charcoal hover:border-cream-dark"
                    }`}
                    onClick={() => toggleAchieved(item)}
                  >
                    <div className="flex items-center gap-2.5 flex-1 min-w-0 text-left">
                      <input
                        type="checkbox"
                        checked={item.achieved || false}
                        onChange={() => {}}
                        className="h-4 w-4 text-indigo-600 accent-indigo-600 rounded cursor-pointer flex-shrink-0"
                      />
                      <span
                        className={`text-xs sm:text-sm truncate ${
                          item.achieved ? "line-through text-charcoal/40" : "text-charcoal/90"
                        }`}
                      >
                        {item.text}
                      </span>
                    </div>
                    <button
                      title="Remove goal"
                      className="text-charcoal/30 hover:text-red-500 text-sm p-1 cursor-pointer transition-colors flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeItem(item.text);
                      }}
                    >
                      ✕
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleStartAchieving}
          className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-full text-sm font-semibold shadow-lg hover:shadow-indigo-500/20 transition-all cursor-pointer"
        >
          Start Achieving 🚀
        </button>
      </div>
    </div>
  );
}

