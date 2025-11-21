import { uid } from "react-uid";

// helpers/getUniqueId.js
export const getUniqueId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // fallback
  return `id_${Date.now()}_${Math.floor(Math.random() * 1e9)}`;
};
