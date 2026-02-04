import axios from "axios";
import { auth } from "@/lib/firebase";

const instance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080",
});

// 🔐 gắn Firebase ID Token
instance.interceptors.request.use(async (config) => {
  const token = await auth.currentUser?.getIdToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// Add useInstructorQuizzes.ts response interceptor
instance.interceptors.response.use(
  function (response) {

    return response;
  },
  function (error) {
    if (error.response && error.response.data) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
);
export default instance;