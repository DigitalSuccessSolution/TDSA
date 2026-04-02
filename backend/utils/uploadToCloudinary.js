const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// const uploadToCloudinary = (file) => {
//   return new Promise((resolve, reject) => {
//     // Determine resource type: PDFs are better served as 'raw' to avoid image-specific security/transform issues
//     const isPDF = file.originalname && file.originalname.toLowerCase().endsWith(".pdf");

//     const uploadStream = cloudinary.uploader.upload_stream(
//       {
//         resource_type: isPDF ? "raw" : "auto",
//         folder: "data-science-academy",
//         public_id: file.originalname
//           ? file.originalname.split(".")[0]
//           : undefined,
//         use_filename: true,
//         unique_filename: true,
//       },
//       (error, result) => {
//         if (error) return reject(error);
//         resolve(result.secure_url);
//       },
//     );
//     uploadStream.end(file.buffer);
//   });
// };
const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {

    const isPDF = file.mimetype === "application/pdf";

    const originalName = file.originalname
      .replace(/\.[^/.]+$/, "")
      .replace(/\s+/g, "_");

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: isPDF ? "raw" : "image",
        folder: "data-science-academy",
        public_id: originalName,
        use_filename: false,
        unique_filename: false,
        format: isPDF ? "pdf" : undefined, // 👈 YE LINE IMPORTANT
      },
      (error, result) => {
        if (error) return reject(error);
        console.log("Final URL:", result.secure_url);
        resolve(result.secure_url);
      }
    );

    uploadStream.end(file.buffer);
  });
};
module.exports = uploadToCloudinary;