import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import axiosInstance, { ROOT_URL } from "../../../api/axios";

const ProfileTab = ({ onLogout }) => {
  const [profileData, setProfileData] = useState({ fullName: "", username: "", profilePhoto: "", isPrivate: false });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/user/profile");
        setProfileData(res.data);
        setPreviewUrl(res.data.profilePhoto);
      } catch (error) {
        console.error("Fetch Profile Error:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const formData = new FormData();
        formData.append("fullName", profileData.fullName);
        formData.append("username", profileData.username);
        if (selectedFile) {
            formData.append("profilePhoto", selectedFile);
        }
        formData.append("isPrivate", profileData.isPrivate);

        const res = await axiosInstance.put("/user/profile", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });

        toast.success(res.data.message || "Profile updated successfully!");
        setProfileData(res.data.user);
        setSelectedFile(null);
    } catch (error) {
        console.error("Update Profile Error:", error);
        toast.error(error.response?.data?.message || "An error occurred!");
    } finally {
        setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await axiosInstance.post("/user/logout");

      if (res.status === 200 || res.data.success) {
        toast.success(res.data.message || "Logged out successfully!");
        setProfileData({ fullName: "", username: "", profilePhoto: "" });
        setSelectedFile(null);
        setPreviewUrl("");

        if (onLogout) {
          onLogout();
        }
      }
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error(error.response?.data?.message || "An error occurred during logout!");
    }
  };

  const profilePhotoUrl = previewUrl?.startsWith("blob")
    ? previewUrl
    : previewUrl?.startsWith("http")
    ? previewUrl
    : previewUrl
    ? `${ROOT_URL}${previewUrl}`
    : `https://ui-avatars.com/api/?name=${profileData.fullName || "User"}`;

  return (
    <div className="font-sans-clean">
      <h2 className="text-xl font-serif-elegant font-normal text-charcoal mb-6">Profile</h2>
      <form onSubmit={handleProfileUpdate} className="space-y-5">
        <div>
          <label className="block text-charcoal font-bold text-xs uppercase tracking-wider mb-1.5">Full Name</label>
          <input
            type="text"
            value={profileData.fullName}
            onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
            className="w-full p-3.5 bg-white border border-cream-dark/85 rounded-xl text-charcoal focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition outline-none text-sm font-medium"
          />
        </div>
        <div>
          <label className="block text-charcoal font-bold text-xs uppercase tracking-wider mb-1.5">Username</label>
          <input
            type="text"
            value={profileData.username}
            onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
            className="w-full p-3.5 bg-white border border-cream-dark/85 rounded-xl text-charcoal focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition outline-none text-sm font-medium"
          />
        </div>
        <div>
          <label className="block text-charcoal font-bold text-xs uppercase tracking-wider mb-1.5">Profile Photo</label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-white border border-cream-dark/80 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
              <img
                src={profilePhotoUrl}
                alt="Profile Preview"
                className="w-full h-full object-cover"
                onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${profileData.fullName || "User"}`}
              />
            </div>
            <div className="flex-1">
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                id="profilePhotoFile"
                className="hidden"
                onChange={handleFileChange}
              />
              <label
                htmlFor="profilePhotoFile"
                className="cursor-pointer inline-block bg-white hover:bg-cream/45 text-charcoal font-semibold text-xs px-4 py-2.5 rounded-xl border border-cream-dark/85 shadow-sm transition"
              >
                {selectedFile ? "Change Photo" : "Upload Photo"}
              </label>
              {selectedFile && (
                <p className="text-[10px] text-charcoal/40 mt-1 truncate max-w-[180px] font-medium">{selectedFile.name}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3.5 bg-indigo-50/20 p-5 rounded-3xl border border-indigo-100/50 shadow-inner">
          <input
            type="checkbox"
            id="isPrivate"
            checked={profileData.isPrivate}
            onChange={(e) => setProfileData({ ...profileData, isPrivate: e.target.checked })}
            className="w-5 h-5 accent-indigo-600 rounded-md cursor-pointer transition-all mt-0.5"
          />
          <div className="flex flex-col">
            <label htmlFor="isPrivate" className="text-charcoal font-bold text-sm cursor-pointer flex items-center gap-1.5">
              Private Account 🔐
            </label>
            <p className="text-xs text-charcoal/50 font-medium leading-relaxed mt-0.5">
              Only your connections can see your profile details and challenge proofs.
            </p>
          </div>
        </div>

        <div className="flex gap-3.5 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3.5 bg-charcoal hover:bg-black text-white rounded-full font-semibold shadow-md text-xs transition cursor-pointer"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="px-6 py-3.5 border border-charcoal/20 hover:bg-charcoal/5 text-charcoal rounded-full font-semibold text-xs transition cursor-pointer"
          >
            Logout
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileTab;
