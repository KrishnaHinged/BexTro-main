"use client";

import React from "react";
import ChallengeCard from "./ChallengeCard";

const ChallengeList = ({ challenges, onComplete, onAbandon }) => {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-serif-elegant font-normal text-charcoal mt-6 mb-6">Accepted Challenges</h2>
      {challenges && challenges.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge, index) => (
            <ChallengeCard
              key={index}
              challenge={challenge}
              index={index}
              onComplete={onComplete}
              onAbandon={onAbandon}
              isOwner={true}
            />
          ))}
        </div>
      ) : (
        <p className="text-charcoal/40 italic text-sm">No challenges accepted yet!</p>
      )}
    </section>
  );
};

export default ChallengeList;
