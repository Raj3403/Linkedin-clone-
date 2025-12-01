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
        console.log("Profile image URL:", imageUrl);

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

// ✅ Post image upload via backend + Cloudinary
export const UploadPostImage = (file, setPostImage) => {
  console.log("UploadPostImage called with:", file);

  return new Promise((resolve, reject) => {
    if (!file) {
      console.error("UploadPostImage: file is missing");
      return reject("file-missing");
    }

    const formData = new FormData();
    formData.append("photo", file); // 👈 must match upload.single("photo") on backend

    // 👇 Use your backend route for post images
    // If you don't have /api/post-photo yet, you can:
    //   - create it, OR
    //   - temporarily reuse /api/profile-photo here too
    fetch("http://localhost:5000/api/profile-photo", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Backend post-image response:", data);

        if (!data.success || !data.url) {
          console.error("Backend post image upload error:", data);
          return reject("upload-failed");
        }

        const imageUrl = data.url; // ✅ Cloudinary URL for the post image
        console.log("Post image URL:", imageUrl);

        // update React state in PostStatus (or wherever you call this)
        try {
          setPostImage(imageUrl);
        } catch (e) {
          console.warn("setPostImage threw, but image uploaded:", e);
        }

        resolve(imageUrl);
      })
      .catch((error) => {
        console.error("UploadPostImage error:", error);
        reject(error);
      });
  });
};

