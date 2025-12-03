import { editProfile } from "./FirestoreAPI";

/**
 * Helper to extract an image URL from a backend response that may use different keys.
 */
const extractUrlFromResponse = (data) => {
  if (!data) return null;
  return data.url || data.secure_url || data.imageUrl || data.data?.url || null;
};

/**
 * Upload profile image via your backend (which should upload to Cloudinary / S3 etc).
 * Returns the image URL (string) on success, or throws an error.
 */
export const UploadImage = async (file, id) => {
  console.log("UploadImage called with:", { file, id });

  if (!file) {
    console.error("UploadImage: file is missing");
    throw new Error("file-missing");
  }
  if (!id) {
    console.error("UploadImage: id is missing");
    throw new Error("id-missing");
  }

  const formData = new FormData();
  formData.append("photo", file); // must match upload.single("photo") on backend

  try {
    const res = await fetch("http://localhost:5000/api/profile-photo", {
      method: "POST",
      body: formData,
      // DO NOT set 'Content-Type' header for FormData — browser sets it including boundary
    });

    // Network-level error (CORS, network down) often makes res undefined/throws; check res.ok
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("UploadImage: non-OK response:", res.status, res.statusText, text);
      throw new Error(`upload-failed: ${res.status}`);
    }

    const data = await res.json().catch(async (e) => {
      // If JSON parsing fails, attempt to read text for debugging
      const txt = await res.text().catch(() => "(no body)");
      console.error("UploadImage: JSON parse error:", e, "responseText:", txt);
      throw new Error("invalid-json-response");
    });

    console.log("Backend response:", data);

    const imageUrl = extractUrlFromResponse(data);
    if (!imageUrl) {
      console.error("UploadImage: backend did not return a usable URL:", data);
      throw new Error("no-image-url");
    }

    // Persist to Firestore (await so caller knows it's saved)
    try {
      // editProfile from your Firestore API is async in the file we fixed earlier
      await editProfile(id, { imageLink: imageUrl });
    } catch (e) {
      // we still resolve because image is uploaded; but warn so you can debug DB issues
      console.warn("UploadImage: editProfile threw, image uploaded but not saved to profile:", e);
      // optionally rethrow if you want caller to handle DB failure
      // throw e;
    }

    console.log("Profile image URL:", imageUrl);
    return imageUrl;
  } catch (error) {
    // Common issues: backend not running, CORS blocked, mixed-content (HTTPS page + HTTP fetch), wrong route
    console.error("UploadImage error:", error);
    throw error;
  }
};

/**
 * Upload an image to be used in a post. Accepts a setter for React state (setPostImage)
 * and returns the uploaded image URL on success.
 *
 * CHANGES: This function is hardened with:
 *  - explicit response-body logging for easier debugging,
 *  - fallback to profile-photo endpoint when post-photo returns 404,
 *  - clearer thrown Error messages,
 *  - tolerant extraction of multiple URL field names.
 */
export const UploadPostImage = async (file, setPostImage) => {
  console.log("UploadPostImage called with:", file);

  if (!file) {
    console.error("UploadPostImage: file is missing");
    throw new Error("file-missing");
  }

  const formData = new FormData();
  formData.append("photo", file);

  // helper to attempt upload to a given route and return parsed data or throw
  const attemptUpload = async (url) => {
    try {
      const res = await fetch(url, {
        method: "POST",
        body: formData,
      });

      // capture raw text for debugging if not ok or json parse fails
      const rawText = await res.text().catch(() => "");

      if (!res.ok) {
        console.error(`UploadPostImage: ${url} returned ${res.status}`, rawText);
        // return an object containing status so caller can decide fallback
        return { ok: false, status: res.status, bodyText: rawText };
      }

      // try parse JSON from the text
      let data;
      try {
        data = rawText ? JSON.parse(rawText) : null;
      } catch (e) {
        console.error("UploadPostImage: JSON parse error for", url, rawText, e);
        return { ok: false, status: res.status, bodyText: rawText, parseError: true };
      }

      return { ok: true, status: res.status, data };
    } catch (networkErr) {
      console.error("UploadPostImage: network/fetch error for", url, networkErr);
      return { ok: false, networkErr };
    }
  };

  // first try your post-photo endpoint
  const endpoints = [
    "http://localhost:5000/api/post-photo",    // preferred for posts
    "http://localhost:5000/api/profile-photo", // fallback if post route isn't available
  ];

  let uploadResult = null;
  for (let i = 0; i < endpoints.length; i++) {
    const ep = endpoints[i];
    const result = await attemptUpload(ep);

    if (result.ok && result.data) {
      uploadResult = result;
      break;
    }

    // if 404 on post-photo, try the next (fallback)
    // if networkErr or parseError, continue to next to give more chance
    // otherwise capture last result for final error
    uploadResult = uploadResult || result;
  }

  // after attempts, check result
  if (!uploadResult || !uploadResult.ok) {
    // Construct helpful error reason
    if (uploadResult && uploadResult.networkErr) {
      throw new Error(`network-error:${uploadResult.networkErr.message || "unknown"}`);
    }
    if (uploadResult && uploadResult.parseError) {
      throw new Error(`invalid-json-response:${uploadResult.bodyText || ""}`);
    }
    if (uploadResult && uploadResult.status) {
      throw new Error(`upload-failed-status:${uploadResult.status}:${uploadResult.bodyText || ""}`);
    }
    throw new Error("upload-failed:unknown");
  }

  const data = uploadResult.data;
  console.log("Backend post-image response (parsed):", data);

  const imageUrl = extractUrlFromResponse(data);
  if (!imageUrl) {
    console.error("UploadPostImage: backend did not return a usable URL:", data);
    throw new Error("no-image-url");
  }

  // Update React state (if provided)
  try {
    if (typeof setPostImage === "function") {
      setPostImage(imageUrl);
    }
  } catch (e) {
    console.warn("UploadPostImage: setPostImage threw, but image uploaded:", e);
  }

  console.log("Post image URL:", imageUrl);
  return imageUrl;
};



