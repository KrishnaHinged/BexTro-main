"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "@/api/axios";
import { toast } from "react-hot-toast";
import { setAuthUser } from "@/redux/userSlice";

import MainSlideBar from "@/components/layout/MainSlideBar";
import PageLoader from "@/components/common/loaders/pagesLoader";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import RewardPopup from "@/components/features/posts/RewardPopup";

import GamificationUI from "@/components/features/profile/GamificationUI";
import ChallengesSection from "@/components/features/profile/ChallengesSection";
import RequestsSection from "@/components/features/profile/RequestsSection";
import ConnectionsSection from "@/components/features/profile/ConnectionsSection";
import ProofModal from "@/components/features/profile/ProofModal";
import Header from "@/components/features/profile/Header";

const TABS = ["challenges", "requests", "connections"];

export default function SelfProfile() {
  const [activeTab, setActiveTab] = useState("challenges");
  const [connectionRequests, setConnectionRequests] = useState({ received: [], sent: [] });
  const [connections, setConnections] = useState([]);
  const [completedPosts, setCompletedPosts] = useState([]);
  const [rewardData, setRewardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  const dispatch = useDispatch();
  const { authUser, isAuthenticated } = useSelector((state) => state.user);
  const isRehydrated = useSelector((state) => state._persist?.rehydrated);

  const acceptedChallenges = authUser?.acceptedChallenges || [];

  const fetchProfileData = async () => {
    if (!authUser?._id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [profileRes, requestsRes, connectionsRes, postsRes] = await Promise.all([
        axiosInstance.get("/user/profile"),
        axiosInstance.get("/user/connections/requests"),
        axiosInstance.get("/user/connections"),
        axiosInstance.get(`/posts/user/${authUser._id}`),
      ]);

      dispatch(setAuthUser(profileRes.data));
      setConnectionRequests(requestsRes.data);
      setConnections(connectionsRes.data);
      setCompletedPosts(postsRes.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile data!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && authUser) fetchProfileData();
  }, [authUser?._id, isAuthenticated]);

  const handleProofSuccess = (responseData) => {
    if (responseData.post) {
      setCompletedPosts((prev) => [responseData.post, ...prev]);
    }
    if (responseData.rewards) {
      setRewardData(responseData.rewards);
    }
    fetchProfileData();
  };

  const handleDropChallenge = async (challengeText) => {
    try {
      setActionLoading(true);
      await axiosInstance.post("/challenges/abandon", { challengeText });
      toast.success("Challenge dropped successfully");
      await fetchProfileData();
    } catch (error) {
      toast.error("Failed to abandon challenge");
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAcceptRequest = async (userId) => {
    try {
      await axiosInstance.post(`/user/${userId}/accept`, {});
      toast.success("Connection request accepted!");
      await fetchProfileData();
    } catch (error) {
      toast.error("Failed to accept request");
      console.error(error);
    }
  };

  const handleRejectRequest = async (userId) => {
    try {
      await axiosInstance.post(`/user/${userId}/reject`, {});
      toast.success("Connection request rejected.");
      await fetchProfileData();
    } catch (error) {
      toast.error("Failed to reject request");
      console.error(error);
    }
  };

  const handleToggleVisibility = async (postId, currentVisibility) => {
    try {
      const nextVisibility = currentVisibility === "private" ? "public" : "private";
      const res = await axiosInstance.put(`/posts/${postId}/visibility`, { visibility: nextVisibility });
      toast.success(`Post visibility updated to ${nextVisibility}`);
      setCompletedPosts(prev =>
        prev.map(p => (p._id === postId ? { ...p, visibility: nextVisibility } : p))
      );
    } catch (error) {
      toast.error("Failed to update visibility");
      console.error(error);
    }
  };

  if (!isRehydrated || loading) {
    return <PageLoader message="Loading profile..." />;
  }

  if (!isAuthenticated || !authUser) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center font-sans-clean px-4">
        <div className="bg-cream-card rounded-[2.5rem] border border-cream-dark/80 p-8 sm:p-10 shadow-xl text-center max-w-sm w-full">
          <h2 className="text-2xl font-serif-elegant font-normal text-charcoal mb-4">Please Sign In</h2>
          <p className="text-charcoal/60 text-sm mb-6">You need to be logged in to view your profile.</p>
          <a href="/signin" className="bg-charcoal hover:bg-black text-white px-6 py-3 rounded-full font-bold shadow-md block text-sm transition-all text-center">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen bg-cream text-charcoal font-sans-clean">
        <MainSlideBar />

        <div className="flex-1 p-6 md:p-10 overflow-y-auto">
          {/* Header Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <Header user={authUser} connections={connections} />
            <GamificationUI score={authUser.score || 0} />
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-cream-card border border-cream-dark/80 p-1.5 rounded-full w-96 shadow-sm">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  className={`flex-1 py-2.5 rounded-full text-xs font-semibold transition cursor-pointer border-none outline-none ${
                    activeTab === tab
                      ? "bg-charcoal text-white shadow-sm font-bold"
                      : "text-charcoal/50 hover:text-charcoal bg-transparent"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "challenges" && "Challenges"}
                  {tab === "requests" && `Requests (${connectionRequests.received.length})`}
                  {tab === "connections" && "Connections"}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl mx-auto bg-cream-card border border-cream-dark/80 rounded-[2.5rem] p-6 sm:p-8 shadow-sm">
            {activeTab === "challenges" && (
              <ChallengesSection
                acceptedChallenges={acceptedChallenges}
                completedPosts={completedPosts}
                onRequestProof={setSelectedChallenge}
                onDrop={handleDropChallenge}
                onToggleVisibility={handleToggleVisibility}
                actionLoading={actionLoading}
              />
            )}

            {activeTab === "requests" && (
              <RequestsSection
                requests={connectionRequests}
                onAccept={handleAcceptRequest}
                onReject={handleRejectRequest}
              />
            )}

            {activeTab === "connections" && (
              <ConnectionsSection connections={connections} />
            )}
          </div>
        </div>

        {/* Proof Submission Modal */}
        {selectedChallenge && (
          <ProofModal
            challenge={selectedChallenge}
            onClose={() => setSelectedChallenge(null)}
            onSuccess={handleProofSuccess}
          />
        )}

        {/* Reward Success Popup */}
        {rewardData && (
          <RewardPopup
            rewards={rewardData}
            onClose={() => setRewardData(null)}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
