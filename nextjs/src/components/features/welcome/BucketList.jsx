"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import axiosInstance from "@/api/axios";
import { toast } from "react-hot-toast";
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
  ArrowRight,
  Layers,
  RotateCcw,
  Bot
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

export default function BucketList({ userInterests: propInterests }) {
  const [bucketList, setBucketList] = useState([]);
  const [interests, setInterests] = useState(propInterests || []);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
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
      });
  }, []);

  // Fetch AI-crafted bucket list tailored to this user
  const fetchAISuggestions = async (interestsToUse, isUserTriggered = false) => {
    setIsLoadingAI(true);
    try {
      const res = await axiosInstance.post("/userdata/suggest-bucket-list", {
        interests: interestsToUse || []
      });
      if (res.data?.suggestions && Array.isArray(res.data.suggestions)) {
        setAiSuggestions(res.data.suggestions);
        if (isUserTriggered) {
          toast.success("AI generated fresh ideas! ✨");
        }
      }
    } catch (err) {
      console.error("Failed to load AI suggestions:", err);
      // Fallback locally with randomization
      const fallback = getSuggestionsForInterests(interestsToUse);
      const items = [];
      fallback.forEach((cat) => {
        const shuffled = [...(cat.items || [])].sort(() => Math.random() - 0.5);
        shuffled.slice(0, 3).forEach((text) => {
          items.push({
            text,
            categoryKey: cat.categoryKey,
            categoryLabel: cat.categoryLabel,
            iconName: cat.iconName
          });
        });
      });
      setAiSuggestions(items.sort(() => Math.random() - 0.5));
      if (isUserTriggered) {
        toast.success("AI refreshed your suggestions!");
      }
    } finally {
      setTimeout(() => setIsLoadingAI(false), 300);
    }
  };

  // If interests weren't passed as prop, load from user's profile
  useEffect(() => {
    let isCancelled = false;
    if (!propInterests || propInterests.length === 0) {
      axiosInstance
        .get("/userdata/interests")
        .then((res) => {
          if (!isCancelled) {
            const loaded = res.data?.interests || [];
            setInterests(loaded);
            fetchAISuggestions(loaded);
          }
        })
        .catch((err) => {
          if (!isCancelled) {
            console.error("Error fetching user interests:", err);
            fetchAISuggestions([]);
          }
        });
    } else {
      (async () => {
        await Promise.resolve();
        if (!isCancelled) {
          fetchAISuggestions(propInterests);
        }
      })();
    }
    return () => {
      isCancelled = true;
    };
  }, [propInterests]);

  const existingTexts = useMemo(() => {
    return new Set(bucketList.map((item) => item.text?.toLowerCase().trim()));
  }, [bucketList]);

  // Extract unique categories from AI suggestions
  const suggestionCategories = useMemo(() => {
    const catsMap = new Map();
    aiSuggestions.forEach((sug) => {
      if (!catsMap.has(sug.categoryKey)) {
        catsMap.set(sug.categoryKey, {
          key: sug.categoryKey,
          label: sug.categoryLabel || sug.categoryKey,
          iconName: sug.iconName || "Target"
        });
      }
    });
    return Array.from(catsMap.values());
  }, [aiSuggestions]);

  // Filtered suggestions based on active category tab
  const visibleSuggestions = useMemo(() => {
    if (activeCategory === "all") {
      return aiSuggestions;
    }
    return aiSuggestions.filter((s) => s.categoryKey === activeCategory);
  }, [aiSuggestions, activeCategory]);

  const addSpecificItem = async (textToAdd) => {
    const trimmed = textToAdd.trim();
    if (!trimmed) return;

    if (existingTexts.has(trimmed.toLowerCase())) {
      toast("This goal is already in your bucket list!");
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
      toast.success("Added to bucket list!");
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
        toast.success(updatedItem.achieved ? "Marked as achieved!" : "Marked as active");
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

        {/* AI-Suggested Bucket List Section */}
        <div className="mb-8 p-5 bg-white/60 border border-cream-dark/70 rounded-3xl text-left shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-charcoal/70">
                AI Suggested For Your Profile
              </span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1">
                <Bot className="w-2.5 h-2.5" />
                <span>AI Powered</span>
              </span>
            </div>
            
            <button
              type="button"
              disabled={isLoadingAI}
              onClick={() => fetchAISuggestions(interests, true)}
              className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-medium px-2.5 py-1 rounded-lg hover:bg-indigo-50/50 transition cursor-pointer border-none bg-transparent"
              title="Refresh AI suggestions"
            >
              <RotateCcw className={`w-3 h-3 ${isLoadingAI ? "animate-spin" : ""}`} />
              <span>{isLoadingAI ? "Crafting..." : "Refresh with AI"}</span>
            </button>
          </div>

          {isLoadingAI ? (
            <div className="py-8 flex flex-col items-center justify-center gap-2.5 text-charcoal/50">
              <Sparkles className="w-6 h-6 text-indigo-500 animate-spin" />
              <p className="text-xs font-medium">AI is generating customized bucket list goals for you...</p>
            </div>
          ) : (
            <>
              {/* Category Filter Tabs */}
              {suggestionCategories.length > 1 && (
                <div className="flex flex-wrap gap-1.5 mb-3 pb-1 border-b border-cream-dark/40">
                  <button
                    type="button"
                    onClick={() => setActiveCategory("all")}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeCategory === "all"
                        ? "bg-charcoal text-white shadow-xs"
                        : "bg-cream-dark/30 text-charcoal/60 hover:text-charcoal hover:bg-cream-dark/50"
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>All Focuses</span>
                  </button>
                  {suggestionCategories.map((cat) => (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => setActiveCategory(cat.key)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                        activeCategory === cat.key
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "bg-cream-dark/30 text-charcoal/60 hover:text-charcoal hover:bg-cream-dark/50"
                      }`}
                    >
                      <CategoryIcon name={cat.iconName} className="w-3.5 h-3.5" />
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Suggestion Chips Grid */}
              <div className="flex flex-wrap gap-2 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin">
                {visibleSuggestions.length === 0 ? (
                  <p className="text-xs text-charcoal/40 italic py-2">No suggestions available in this category.</p>
                ) : (
                  visibleSuggestions.map((sug, idx) => {
                    const isAdded = existingTexts.has(sug.text?.toLowerCase().trim());
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
                        <CategoryIcon name={sug.iconName} className="w-3.5 h-3.5 text-charcoal/60 flex-shrink-0" />
                        <span className="truncate max-w-[240px] sm:max-w-[320px]">{sug.text}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          isAdded ? "bg-emerald-100 text-emerald-700" : "bg-charcoal/5 text-charcoal/70"
                        }`}>
                          {isAdded ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3 text-charcoal/50" />
                              <span>Add</span>
                            </>
                          )}
                        </span>
                      </motion.button>
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>

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
                      className="text-charcoal/30 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 cursor-pointer transition-colors flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeItem(item.text);
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
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
          className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-full text-sm font-semibold shadow-lg hover:shadow-indigo-500/20 transition-all cursor-pointer"
        >
          <span>Start Achieving</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}

