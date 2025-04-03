import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://api-prod.aio.events/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // Matches credentials: "include"
});

// Logout function (no localStorage or redirect, mimics Redux logout)
const logoutUser = () => {
  console.log("Logged out due to refresh failure");
  // No localStorage.clear() since we’re not using it
  // No window.location.href since app doesn’t redirect
};

// Request interceptor: No token management
apiClient.interceptors.request.use(
  (config) => {
    // No Authorization header; rely on cookies sent with withCredentials
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with re-authentication
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 403 with refresh logic, exclude specific endpoints
    if (
      error.response?.status === 403 &&
      !originalRequest._retry &&
      originalRequest.url !== "/user/login" &&
      originalRequest.url !== "https://api-prod.aio.events/api/user/resendmailverifytoken"
    ) {
      originalRequest._retry = true;

      console.log("Session expired, attempting refresh:", originalRequest.url);

      try {
        // Refresh session via /user/token (server updates cookies)
        const refreshResponse = await axios.post(
          "https://api-prod.aio.events/api/user/token",
          {}, // No refresh_token in body; server uses cookies
          { withCredentials: true }
        );

        // No token extraction; assume server sets cookie via Set-Cookie
        console.log("Session refreshed successfully:", refreshResponse.data);

        // Retry the original request with updated cookie
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("Refresh failed:", refreshError);
        logoutUser(); // Logout without affecting client-side state
        return Promise.reject(error); // Return original error
      }
    }

    console.error("Request failed:", error.response?.status, error.response?.data, error.message);
    return Promise.reject(error);
  }
);

export default apiClient;