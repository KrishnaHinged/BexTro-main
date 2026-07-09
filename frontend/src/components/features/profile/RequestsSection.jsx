import React from "react";
import { getProfilePhoto } from "../../../utils/getProfilePhoto";

const RequestsSection = ({ requests, onAccept, onReject }) => {
  return (
    <div className="space-y-8 font-sans-clean">
      {/* Received */}
      <div>
        <h2 className="text-xl font-serif-elegant font-normal text-charcoal mb-4">
          Received Requests ({requests.received.length})
        </h2>
        <div className="space-y-3">
          {requests.received.map((user) => (
            <div
              key={user._id}
              className="bg-cream-card border border-cream-dark/80 rounded-2xl p-4 flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-3">
                <img
                  src={getProfilePhoto(user.profilePhoto, user.username)}
                  alt="avatar"
                  className="w-12 h-12 rounded-xl bg-charcoal/10 object-cover border border-cream-dark shadow-sm"
                />
                <div>
                  <h4 className="text-charcoal font-semibold text-sm">{user.fullName}</h4>
                  <span className="text-charcoal/50 text-xs font-medium">@{user.username}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onAccept(user._id)}
                  className="bg-charcoal hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition cursor-pointer"
                >
                  Accept
                </button>
                <button
                  onClick={() => onReject(user._id)}
                  className="border border-charcoal/20 hover:bg-charcoal/5 text-charcoal px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
          {requests.received.length === 0 && (
            <div className="text-center text-charcoal/40 py-8 text-sm font-medium">No pending requests</div>
          )}
        </div>
      </div>

      {/* Sent */}
      <div>
        <h2 className="text-xl font-serif-elegant font-normal text-charcoal mb-4">
          Sent Requests ({requests.sent.length})
        </h2>
        <div className="space-y-3">
          {requests.sent.map((user) => (
            <div
              key={user._id}
              className="bg-cream-card border border-cream-dark/80 rounded-2xl p-4 flex items-center shadow-sm"
            >
              <img
                src={getProfilePhoto(user.profilePhoto, user.username)}
                alt="avatar"
                className="w-12 h-12 rounded-xl bg-charcoal/10 mr-4 object-cover border border-cream-dark shadow-sm"
              />
              <div>
                <h4 className="text-charcoal font-semibold text-sm">{user.fullName}</h4>
                <span className="text-charcoal/40 text-xs font-medium">@{user.username} — Pending</span>
              </div>
            </div>
          ))}
          {requests.sent.length === 0 && (
            <div className="text-center text-charcoal/40 py-8 text-sm font-medium">No sent requests</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestsSection;