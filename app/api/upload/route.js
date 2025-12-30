import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(req) {
  try {
    // Validate file size and type
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    const data = await req.formData();
    const file = data.get('file');

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: `File size must be less than 5MB. Current: ${(file.size / 1024 / 1024).toFixed(2)}MB` }, { status: 400 });
    }
    
    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: `Invalid file type. Allowed: ${ALLOWED_TYPES.join(', ')}` }, { status: 400 });
    }

    // Convert file to buffer for Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log(`Starting upload to Cloudinary. File size: ${buffer.length} bytes`);

    // Upload to Cloudinary using a stream
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: "job-portal",
          resource_type: "auto", // Handle images, pdfs, etc.
          timeout: 60000 // 60s timeout
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary Stream Error:", error);
            reject(error);
          } else {
            console.log("Cloudinary Upload Success:", result.public_id);
            resolve(result);
          }
        }
      );

      // Handle stream errors explicitly
      uploadStream.on('error', (err) => {
        console.error("Stream connection error:", err);
        reject(err);
      });

      uploadStream.end(buffer);
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    console.error("Upload handler detailed error:", error);
    return NextResponse.json({ error: "Upload failed: " + error.message }, { status: 500 });
  }
}