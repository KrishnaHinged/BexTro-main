"use client";

import React, { useState, useEffect } from "react";
import axiosInstance from "@/api/axios";
import { toast } from "react-hot-toast";
import MainSlideBar from "@/components/layout/MainSlideBar";
import PageLoader from "@/components/common/loaders/pagesLoader";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import Button from "@/components/ui/Button";
import CommunitiesList from "@/components/features/communities/CommunitiesList";
import CommunityChatsSection from "@/components/features/communities/CommunityChatsSection";
import CreateCommunityModal from "@/components/features/communities/CreateCommunityModal";

export default function Community() {
  const [communities, setCommunities] = useState([]);
  const [myCommunities, setMyCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("communities");
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  });
  const [showChatList, setShowChatList] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const fetchCommunities = async () => {
    try {
      const [exploreRes, myRes] = await Promise.all([
        axiosInstance.get("/communities/explore"),
        axiosInstance.get("/communities/my-communities")
      ]);
      setCommunities(exploreRes.data || []);
      setMyCommunities(myRes.data || []);
    } catch (error) {
      console.error("Error fetching communities", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isCancelled = false;
    async function load() {
      try {
        const [exploreRes, myRes] = await Promise.all([
          axiosInstance.get("/communities/explore"),
          axiosInstance.get("/communities/my-communities")
        ]);
        if (!isCancelled) {
          setCommunities(exploreRes.data || []);
          setMyCommunities(myRes.data || []);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("Error fetching communities", error);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }
    load();

    if (typeof window !== "undefined") {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
        if (window.innerWidth >= 768) {
          setShowChatList(true);
        }
      };
      window.addEventListener("resize", handleResize);
      return () => {
        isCancelled = true;
        window.removeEventListener("resize", handleResize);
      };
    }
    return () => {
      isCancelled = true;
    };
  }, []);

  const handleCreateCommunity = async ({ name, description, photoFile }) => {
    setIsCreating(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      if (photoFile) formData.append("profilePhoto", photoFile);

      await axiosInstance.post("/communities/create", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setShowCreate(false);
      toast.success("Community created successfully!");
      fetchCommunities();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create community");
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoin = async (id) => {
    try {
      await axiosInstance.post(`/communities/join/${id}`, {});
      toast.success("Joined successfully!");
      fetchCommunities();
    } catch (error) {
      console.error(error);
      toast.error("Failed to join community");
    }
  };

  const toggleChatList = () => {
    setShowChatList((prev) => !prev);
  };

  if (loading) return <PageLoader message="Loading Communities..." />;

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen bg-cream text-charcoal font-sans-clean">
        <MainSlideBar />
        <div className="flex-1 p-6 md:p-10 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl md:text-5xl font-serif-elegant font-normal text-charcoal tracking-tight">
              Community<span className="text-indigo-600">.</span>
            </h1>

            {activeTab === "communities" && (
              <Button
                variant="primary"
                size="md"
                onClick={() => setShowCreate(true)}
                className="shadow-sm"
              >
                + Create Community
              </Button>
            )}

            {activeTab === "chats" && isMobile && (
              <Button
                variant="primary"
                size="sm"
                onClick={toggleChatList}
                className="md:hidden"
              >
                {showChatList ? "Hide List" : "Show List"}
              </Button>
            )}
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-cream-card border border-cream-dark/80 p-1.5 rounded-full w-72 shadow-2xs">
              <button
                type="button"
                className={`flex-1 py-2 rounded-full text-xs font-semibold transition cursor-pointer select-none ${
                  activeTab === "communities"
                    ? "bg-charcoal text-white shadow-xs font-bold"
                    : "text-charcoal/50 hover:text-charcoal bg-transparent"
                }`}
                onClick={() => setActiveTab("communities")}
              >
                Communities
              </button>
              <button
                type="button"
                className={`flex-1 py-2 rounded-full text-xs font-semibold transition cursor-pointer select-none ${
                  activeTab === "chats"
                    ? "bg-charcoal text-white shadow-xs font-bold"
                    : "text-charcoal/50 hover:text-charcoal bg-transparent"
                }`}
                onClick={() => setActiveTab("chats")}
              >
                Chats
              </button>
            </div>
          </div>

          {activeTab === "communities" ? (
            <CommunitiesList
              communities={communities}
              myCommunities={myCommunities}
              onJoin={handleJoin}
              onOpenChat={() => setActiveTab("chats")}
            />
          ) : (
            <CommunityChatsSection
              isMobile={isMobile}
              showChatList={showChatList}
            />
          )}
        </div>

        {/* Create Community Modal */}
        <CreateCommunityModal
          isOpen={showCreate}
          onClose={() => setShowCreate(false)}
          onSubmit={handleCreateCommunity}
          isSubmitting={isCreating}
        />
      </div>
    </ErrorBoundary>
  );
}
