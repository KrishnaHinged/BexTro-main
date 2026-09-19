"use client";

import React from "react";

const SkippedChallenges = ({ skippedCount }) => {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-serif-elegant font-normal text-charcoal mb-6">Skipped Challenges</h2>
      <div className="p-6 bg-cream-card rounded-2xl shadow-sm border border-cream-dark/80">
        <p className="text-charcoal text-sm">
          Total Skipped: <span className="font-bold text-indigo-600">{skippedCount}</span>
        </p>
      </div>
    </section>
  );
};

export default SkippedChallenges;
