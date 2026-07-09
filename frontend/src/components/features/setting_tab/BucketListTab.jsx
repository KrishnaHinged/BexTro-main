import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../../redux/userSlice.js";
import axiosInstance from "../../../api/axios.js";

const BucketListTab = () => {
  const [bucketList, setBucketList] = useState([]);
  const [newItem, setNewItem] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchBucketList = async () => {
      try {
        const response = await axiosInstance.get("/userdata/bucket-list");
        setBucketList(response.data.bucketList || []);
      } catch (error) {
        console.error("Fetch Bucket List Error:", error);
        if (error.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
          dispatch(logoutUser());
          navigate("/signup");
          return;
        }
        toast.error("Failed to load bucket list!");
      }
    };
    fetchBucketList();
  }, [navigate, dispatch]);

  const handleAddItem = async () => {
    const trimmedItem = newItem.trim();
    if (!trimmedItem) {
      return toast.error("Item cannot be empty!");
    }
    if (bucketList.some((entry) => entry.text === trimmedItem)) {
      return toast.error("This item already exists in your bucket list!");
    }
    try {
      const response = await axiosInstance.post("/userdata/bucket-list", {
        action: "add",
        item: { text: trimmedItem, achieved: false }
      });
      setBucketList([...bucketList, { text: trimmedItem, achieved: false }]);
      setNewItem("");
      toast.success(response.data.message || "Item added to bucket list!");
    } catch (error) {
      console.error("Add Bucket List Item Error:", error);
      toast.error(error.response?.data?.error || "Failed to add item!");
    }
  };

  const handleRemoveItem = async (text) => {
    try {
      const response = await axiosInstance.post("/userdata/bucket-list", {
        action: "remove",
        item: { text }
      });
      setBucketList(bucketList.filter((entry) => entry.text !== text));
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
      <h2 className="text-xl font-serif-elegant font-normal text-charcoal mb-6">Bucket List</h2>
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add a new bucket list item"
          className="flex-1 p-3.5 bg-white border border-cream-dark/85 rounded-xl text-charcoal placeholder-charcoal/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-medium"
        />
        <button
          onClick={handleAddItem}
          className="px-6 py-2 bg-charcoal hover:bg-black text-white text-xs font-semibold rounded-full shadow-sm transition cursor-pointer"
        >
          Add
        </button>
      </div>
      <div className="space-y-3">
        {bucketList.map((entry) => (
          <div
            key={entry.text}
            className="flex items-center justify-between bg-cream border border-cream-dark/60 p-4 rounded-2xl shadow-sm"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={entry.achieved}
                onChange={() => handleUpdateAchieved(entry.text, entry.achieved)}
                className="h-5 w-5 text-indigo-600 accent-indigo-600 rounded cursor-pointer"
              />
              <span className={`text-sm font-medium ${entry.achieved ? "line-through text-charcoal/40" : "text-charcoal"}`}>
                {entry.text}
              </span>
            </div>
            <button
              onClick={() => handleRemoveItem(entry.text)}
              className="text-rose-500 hover:text-rose-700 text-lg cursor-pointer select-none font-bold"
            >
              ×
            </button>
          </div>
        ))}
        {bucketList.length === 0 && (
          <p className="text-charcoal/40 text-xs italic font-medium">Your bucket list is empty.</p>
        )}
      </div>
    </div>
  );
};

export default BucketListTab;