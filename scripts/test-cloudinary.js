import { v2 as cloudinary } from 'cloudinary';

// Manually load env vars for this script since it's standalone
const config = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

console.log("Checking Cloudinary Config...");
console.log("Cloud Name:", config.cloud_name ? "OK" : "MISSING");
console.log("API Key:", config.api_key ? "OK" : "MISSING");
console.log("API Secret:", config.api_secret ? "OK" : "MISSING");

cloudinary.config(config);

cloudinary.api.ping()
  .then(res => console.log("Cloudinary Connection Success:", res))
  .catch(err => {
    console.error("Cloudinary Connection Failed:", err);
    // Print more details if available
    if (err.error) console.error(err.error);
  });
