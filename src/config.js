// URL ของ backend API — ใช้ localhost ตอน dev ในเครื่อง และสลับไปที่ backend ที่ deploy
// จริงตอน build production ผ่าน VITE_API_BASE_URL (ดู .env.production)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5010";
