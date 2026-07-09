import { ROOT_URL } from "../api/axios";

export const getProfilePhoto = (photo, username) => {
  if (!photo) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(username || "User")}`;
  }

  // if already full URL
  if (photo.startsWith("http")) return photo;

  // if stored path
  return `${ROOT_URL}${photo}`;
};