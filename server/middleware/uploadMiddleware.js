import multer from "multer";

// memoryStorage — no disk needed, works on Vercel
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file max
});

export default upload;