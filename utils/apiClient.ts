import axios from "axios";

interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

const apiClient = axios.create({
  baseURL: "https://api-prod.aio.events/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Logout function
const logoutUser = () => {
  // Clear authentication data
  localStorage.removeItem("authTokens");
  localStorage.removeItem("userData");
  localStorage.removeItem("userTickets");

  // Redirect to login page
  window.location.href = "/";
};

apiClient.interceptors.request.use(
  (config) => {
    const authTokensString = localStorage.getItem("authTokens");
    if (authTokensString) {
      const authTokens: AuthTokens = JSON.parse(authTokensString);
      config.headers.Authorization = `Bearer ${authTokens.access_token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Consolidated response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      !originalRequest._retry &&
      originalRequest.url !== "/user/login" && // Exclude login endpoint
      originalRequest.url !== "https://api-prod.aio.events/api/user/resendmailverifytoken" // Exclude resend endpoint
    ) {
      console.log("Access token expired, logging out:", error.response.status, originalRequest.url);
      originalRequest._retry = true;
      logoutUser();
      return Promise.reject(error);
    }
    console.error("Request failed:", error.response?.status, error.response?.data, error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
