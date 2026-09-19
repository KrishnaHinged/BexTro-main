"use client";

import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/redux/userSlice";
import axiosInstance from "@/api/axios";
import { getSuggestionsForInterests } from "@/utils/bucketListSuggestions";
import {
  Sparkles,
  Code2,
  Palette,
  Music,
  Trophy,
  Compass,
  Dumbbell,
  PenTool,
  TrendingUp,
  Brain,
  Target,
  Plus,
  Check,
  Trash2,
  Layers
} from "lucide-react";

function CategoryIcon({ name, className = "w-3.5 h-3.5" }) {
  switch (name) {
    case "Code2":
      return <Code2 className={className} />;
    case "Palette":
      return <Palette className={className} />;
    case "Music":
      return <Music className={className} />;
    case "Trophy":
      return <Trophy className={className} />;
    case "Compass":
      return <Compass className={className} />;
    case "Dumbbell":
      return <Dumbbell className={className} />;
    case "PenTool":
      return <PenTool className={className} />;
    case "TrendingUp":
      return <TrendingUp className={className} />;
    case "Brain":
      return <Brain className={className} />;
    case "Target":
    default:
      return <Target className={className} />;
  }
}

export default function BucketListTab() {
  const [bucketList, setBucketList] = useState([]);
  const [interests, setInterests] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchBucketListAndInterests = async () => {
      try {
        const [bucketRes, interestsRes] = await Promise.allSettled([
          axiosInstance.get("/userdata/bucket-list"),
          axiosInstance.get("/userdata/interests")
        ]);

        if (bucketRes.status === "fulfilled") {
          setBucketList(bucketRes.value.data.bucketList || []);
        } else if (bucketRes.reason?.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
          dispatch(logoutUser());
          router.push("/signin");
          return;
        }

        if (interestsRes.status === "fulfilled") {
          setInterests(interestsRes.value.data.interests || []);
        }
      } catch (error) {
        console.error("Fetch Data Error:", error);
      }
    };
    fetchBucketListAndInterests();
  }, [router, dispatch]);

  const suggestedCategories = useMemo(() => {
    return getSuggestionsForInterests(interests);
  }, [interests]);

  const existingTexts = useMemo(() => {
    return new Set(bucketList.map((entry) => entry.text?.toLowerCase().trim()));
  }, [bucketList]);

  const visibleSuggestions = useMemo(() => {
    if (activeCategory === "all") {
      const allItems = [];
      suggestedCategories.forEach((cat) => {
        cat.items.forEach((itemText) => {
          allItems.push({
            text: itemText,
            categoryLabel: cat.categoryLabel,
            iconName: cat.iconName
          });
        });
      });
      return allItems;
    }
    const found = suggestedCategories.find((c) => c.categoryKey === activeCategory);
    return (found?.items || []).map((itemText) => ({
      text: itemText,
      categoryLabel: found.categoryLabel,
      iconName: found.iconName
    }));
  }, [suggestedCategories, activeCategory]);

  const handleAddCustomOrSuggested = async (textToAdd) => {
    const trimmedItem = textToAdd.trim();
    if (!trimmedItem) {
      return toast.error("Item cannot be empty!");
    }
    if (existingTexts.has(trimmedItem.toLowerCase())) {
      return toast("This item is already in your bucket list!");
    }

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post("/userdata/bucket-list", {
        action: "add",
        item: { text: trimmedItem, achieved: false }
      });
      setBucketList(response.data.data || [...bucketList, { text: trimmedItem, achieved: false }]);
      if (textToAdd === newItem) setNewItem("");
      toast.success(response.data.message || "Item added to bucket list!");
    } catch (error) {
      console.error("Add Bucket List Item Error:", error);
      toast.error(error.response?.data?.error || "Failed to add item!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveItem = async (text) => {
    try {
      const response = await axiosInstance.post("/userdata/bucket-list", {
        action: "remove",
        item: { text }
      });
      setBucketList(response.data.data || bucketList.filter((entry) => entry.text !== text));
      toast.success(response.data.message || "Item removed from bucket list!");
    } catch (error) {
      console.error("Remove Bucket List Item Error:", error);
      toast.error(error.response?.data?.error || "Failed to remove item!");
    }
  };

  const handleUpdateAchieved = async (text, currentAchieved) => {
    try {
      const updatedItem = { text, achieved: !currentAchieved };
      const response = await axiosInstance.post("/userdata/bucket-list", {
        action: "update",
        item: updatedItem
      });
      setBucketList(
        response.data.data ||
          bucketList.map((entry) =>
            entry.text === text ? { ...entry, achieved: !currentAchieved } : entry
          )
      );
      toast.success(response.data.message || `Item marked as ${!currentAchieved ? "achieved" : "not achieved"}!`);
    } catch (error) {
      console.error("Update Bucket List Item Error:", error);
      toast.error(error.response?.data?.error || "Failed to update item status!");
    }
  };

  return (
    <div className="font-sans-clean">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-serif-elegant font-normal text-charcoal">Bucket List</h2>
        <span className="text-xs text-charcoal/50">
          {bucketList.filter((i) => i.achieved).length} of {bucketList.length} achieved
        </span>
      </div>

      {/* Add Custom Goal */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddCustomOrSuggested(newItem)}
          placeholder="Add a new custom dream goal..."
          className="flex-1 p-3.5 bg-white border border-cream-dark/85 rounded-2xl text-charcoal placeholder-charcoal/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-medium shadow-xs"
        />
        <button
          onClick={() => handleAddCustomOrSuggested(newItem)}
          disabled={isSubmitting || !newItem.trim()}
          className="px-6 py-2 bg-charcoal hover:bg-black disabled:opacity-50 text-white text-xs font-semibold rounded-full shadow-sm transition cursor-pointer border-none outline-none"
        >
          Add Goal
        </button>
      </div>

      {/* Suggested Section */}
      {suggestedCategories.length > 0 && (
        <div className="mb-6 p-4 bg-cream-card/70 border border-cream-dark/80 rounded-2xl">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-xs font-semibold text-charcoal/80 uppercase tracking-wide">
                Suggested Goals (From Your Interests)
              </span>
            </div>
          </div>

          {suggestedCategories.length > 1 && (
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                  activeCategory === "all"
                    ? "bg-charcoal text-white"
                    : "bg-cream-dark/30 text-charcoal/60 hover:bg-cream-dark/50"
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>All</span>
              </button>
              {suggestedCategories.map((cat) => (
                <button
                  key={cat.categoryKey}
                  type="button"
                  onClick={() => setActiveCategory(cat.categoryKey)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition flex items-center gap-1 cursor-pointer ${
                    activeCategory === cat.categoryKey
                      ? "bg-indigo-600 text-white"
                      : "bg-cream-dark/30 text-charcoal/60 hover:bg-cream-dark/50"
                  }`}
                >
                  <CategoryIcon name={cat.iconName} className="w-3 h-3" />
                  <span>{cat.categoryLabel}</span>
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2 max-h-[140px] overflow-y-auto pr-1 scrollbar-thin">
            {visibleSuggestions.map((sug, idx) => {
              const isAdded = existingTexts.has(sug.text.toLowerCase().trim());
              return (
                <button
                  key={`${sug.text}-${idx}`}
                  disabled={isAdded || isSubmitting}
                  onClick={() => handleAddCustomOrSuggested(sug.text)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border text-left flex items-center gap-2 transition cursor-pointer ${
                    isAdded
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800 cursor-default opacity-80"
                      : "bg-white border-cream-dark/80 text-charcoal/80 hover:border-indigo-400 hover:bg-indigo-50/20"
                  }`}
                >
                  <CategoryIcon name={sug.iconName} className="w-3.5 h-3.5 text-charcoal/60 flex-shrink-0" />
                  <span className="truncate max-w-[220px]">{sug.text}</span>
                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 ${
                    isAdded ? "bg-emerald-100 text-emerald-700" : "bg-charcoal/5 text-charcoal/60"
                  }`}>
                    {isAdded ? (
                      <>
                        <Check className="w-2.5 h-2.5 text-emerald-600" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-2.5 h-2.5 text-charcoal/50" />
                        <span>Add</span>
                      </>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Bucket List Items */}
      <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin">
        {bucketList.map((entry) => (
          <div
            key={entry.text}
            className="flex items-center justify-between bg-white border border-cream-dark/70 p-3.5 rounded-2xl shadow-xs"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={entry.achieved || false}
                onChange={() => handleUpdateAchieved(entry.text, entry.achieved)}
                className="h-4 w-4 text-indigo-600 accent-indigo-600 rounded cursor-pointer"
              />
              <span className={`text-sm font-medium ${entry.achieved ? "line-through text-charcoal/40" : "text-charcoal/90"}`}>
                {entry.text}
              </span>
            </div>
            <button
              onClick={() => handleRemoveItem(entry.text)}
              className="text-charcoal/30 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 cursor-pointer transition-colors bg-transparent border-none outline-none"
              title="Remove item"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {bucketList.length === 0 && (
          <p className="text-charcoal/40 text-xs italic font-medium p-3 bg-white/50 rounded-xl text-center">
            Your bucket list is empty. Add a custom goal or tap a suggestion above!
          </p>
        )}
      </div>
    </div>
  );
}


