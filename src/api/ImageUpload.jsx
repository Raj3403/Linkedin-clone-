import { editProfile } from "./FirestoreAPI";

export const UploadImage = (file, id) => {
  console.log("UploadImage called with:", { file, id });

  return new Promise((resolve, reject) => {
    if (!file) {
      console.error("UploadImage: file is missing");
      return reject("file-missing");
    }
    if (!id) {
      console.error("UploadImage: id is missing");
      return reject("id-missing");
    }

    const formData = new FormData();
    formData.append("photo", file); // must match upload.single("photo") on backend

    fetch("http://localhost:5000/api/profile-photo", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Backend response:", data);

        if (!data.success || !data.url) {
          console.error("Backend upload error:", data);
          return reject("upload-failed");
        }

        const imageUrl = data.url; // Cloudinary URL

        // Save URL in Firestore (no need to wait for it to finish to resolve)
        try {
          editProfile(id, { imageLink: imageUrl });
        } catch (e) {
          console.warn("editProfile threw, but image uploaded:", e);
        }

        resolve(imageUrl);
      })
      .catch((error) => {
        console.error("UploadImage error:", error);
        reject(error);
      });
  });
};
