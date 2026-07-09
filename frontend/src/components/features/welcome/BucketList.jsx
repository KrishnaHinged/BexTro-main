import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axios";
import { toast } from "react-hot-toast";

const BucketList = () => {
  const [bucketList, setBucketList] = useState([]);
  const [newItem, setNewItem] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/userdata/bucket-list")
      .then((res) => {
        setBucketList(res.data.bucketList || []);
      })
      .catch((err) => {
        console.error("Error fetching bucket list:", err);
        toast.error(err.response?.data?.error || "Failed to fetch bucket list");
      });
  }, []);

  const addItem = () => {
    if (newItem.trim()) {
      const newItemObj = { text: newItem, achieved: false };
      axiosInstance
        .post("/userdata/bucket-list", { action: "add", item: newItemObj })
        .then((res) => {
          setBucketList(res.data.data || []);
          setNewItem("");
          toast.success("Item added to bucket list!");
        })
        .catch((err) => {
          console.error("Error adding item:", err);
          toast.error(err.response?.data?.error || "Failed to update bucket list");
        });
    }
  };

  const removeItem = (id) => {
    const itemToRemove = bucketList.find((item) => item._id === id);
    if (itemToRemove) {
      axiosInstance
        .post("/userdata/bucket-list", { action: "remove", item: itemToRemove })
        .then((res) => {
          setBucketList(res.data.data || []);
          toast.success("Item removed from bucket list!");
        })
        .catch((err) => {
          console.error("Error removing item:", err);
          toast.error(err.response?.data?.error || "Failed to remove item");
        });
    }
  };

  const toggleAchieved = (id) => {
    const itemToUpdate = bucketList.find((item) => item._id === id);
    if (itemToUpdate) {
      const updatedItem = { ...itemToUpdate, achieved: !itemToUpdate.achieved };
      axiosInstance
        .post("/userdata/bucket-list", { action: "update", item: updatedItem })
        .then((res) => {
          setBucketList(res.data.data || []);
          toast.success(updatedItem.achieved ? "Marked as achieved!" : "Marked as not achieved!");
        })
        .catch((err) => {
          console.error("Error updating item:", err);
          toast.error(err.response?.data?.error || "Failed to update item");
        });
    }
  };

  const handleStartAchieving = () => {
    navigate("/set_challenges");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans-clean">
      <div className="max-w-2xl w-full p-8 sm:p-10 bg-cream-card border border-cream-dark/80 rounded-[2.5rem] shadow-xl text-center">
        <h1 className="text-3xl sm:text-4xl font-serif-elegant font-normal text-charcoal mb-3">
          Your Bucket List
        </h1>
        <p className="text-sm sm:text-base text-charcoal/60 mb-8">
          Because life's too short for regrets. Add, achieve, and repeat.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-8">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add a dream goal (e.g. Run Marathon)"
            className="px-4 py-3 bg-white border border-cream-dark/80 rounded-2xl text-charcoal placeholder-charcoal/30 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none w-full max-w-xs text-sm font-medium"
          />
          <button
            onClick={addItem}
            className="px-6 py-3 bg-charcoal hover:bg-black rounded-full text-white text-sm font-semibold shadow-md cursor-pointer transition-all w-full sm:w-auto"
          >
            Add Goal
          </button>
        </div>

        <div className="flex flex-col gap-3.5 max-w-sm mx-auto mb-10 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
          <AnimatePresence>
            {bucketList.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`px-5 py-3.5 rounded-2xl border cursor-pointer transition-all duration-300 shadow-sm flex items-center justify-between gap-4 ${
                  item.achieved
                    ? "bg-indigo-50/50 border-indigo-200 text-indigo-900 font-semibold"
                    : "bg-white border-cream-dark/60 text-charcoal/80 hover:bg-white/80"
                }`}
                onClick={() => toggleAchieved(item._id)}
              >
                <span className={`text-sm text-left flex-1 ${item.achieved ? "line-through text-indigo-950/40" : ""}`}>
                  {item.text}
                </span>
                <button
                  className="text-charcoal/30 hover:text-red-500 text-xs p-1 cursor-pointer transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeItem(item._id);
                  }}
                >
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <button
          onClick={handleStartAchieving}
          className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-sm font-semibold shadow-lg hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
        >
          Start Achieving 🚀
        </button>
      </div>
    </div>
  );
};

export default BucketList;