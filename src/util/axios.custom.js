// Set config defaults when creating the instance
import axios from "axios";

const instance = axios.create({
  baseURL:  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080',
});

// Alter defaults after instance has been created
// instance.defaults.headers.Common['Authorization'] = localStorage.getItem("accessToken");


// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    config.headers.Authorization = `Bearer ${localStorage.getItem("access_token")}`;
    return config;
  },
  function (error) {
    if (error.response && error.response.data) {
      return Promise.reject(error.response.data); // Trả về data lỗi từ server
    }
    return Promise.reject(error); // Trả về lỗi mặc định
  }
);

// Add a response interceptor
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