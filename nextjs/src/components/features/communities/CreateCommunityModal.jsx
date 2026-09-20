"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

export default function CreateCommunityModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, description, photoFile });
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setPhotoFile(null);
    setPhotoPreview("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-cream-card border border-cream-dark/80 rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl relative font-sans-clean">
        <h2 className="text-2xl font-serif-elegant font-normal text-charcoal mb-6">
          Create Community
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Community Photo */}
          <div>
            <label className="text-charcoal/80 font-bold text-xs uppercase tracking-wider mb-2 block">
              Community Photo
            </label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-white border border-cream-dark/80 flex items-center justify-center overflow-hidden shrink-0 shadow-xs text-xl">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  "📸"
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  id="communityPhoto"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setPhotoFile(file);
                      setPhotoPreview(URL.createObjectURL(file));
                    }
                  }}
                />
                <label
                  htmlFor="communityPhoto"
                  className="cursor-pointer inline-block bg-white hover:bg-cream/40 text-charcoal font-semibold text-xs px-4 py-2.5 rounded-xl border border-cream-dark/85 shadow-xs transition"
                >
                  {photoFile ? "Change Photo" : "Upload Photo"}
                </label>
                {photoFile && (
                  <p className="text-[10px] text-charcoal/40 mt-1.5 truncate max-w-[180px] font-medium">
                    {photoFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Community Name */}
          <Input
            label="Community Name"
            placeholder="E.g. Focus Masters, Algorithmic Minds"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {/* Description */}
          <Textarea
            label="Description"
            placeholder="What shared mission or craft unites this group?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            required
          />

          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              size="md"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              isLoading={isSubmitting}
              className="flex-1 shadow-md"
            >
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
