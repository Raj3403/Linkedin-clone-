// import { storage } from "../firebaseConfig";
// import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { editProfile } from "./FirestoreAPI";
export const UploadImage = (file, id) => {
  if (!file || !id) {
    console.error("UploadImage: missing file or id");
    return;
  }

  const formData = new FormData();
  formData.append("photo", file); // 👈 must match upload.single("photo") in server.js

  // Optional: you can log progress manually if you want later,
  // but for now we just send the file to backend.
  fetch("http://localhost:5000/api/profile-photo", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Backend response:", data);

      if (!data.success || !data.url) {
        console.error("Backend upload error:", data);
        return;
      }

      const imageUrl = data.url; // 👈 Cloudinary secure_url from server.js

      // 🔹 Save only URL in Firestore (same as your old logic)
      editProfile(id, { imageLink: imageUrl });
    })
    .catch((error) => {
      console.error("UploadImage error:", error);
    });
    
};