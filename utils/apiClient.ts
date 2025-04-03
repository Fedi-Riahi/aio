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

      // Special case: Don't treat 404 for seat maps as error
      if (error.response?.status === 404 &&
          originalRequest.url?.includes('/event/getperiods/seats/')) {
        return Promise.resolve({
          data: {
            success: false,
            respond: {
              data: null,
              error: error.response.data?.respond?.error
            }
          }
        });
      }

      // Handle auth errors normally
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403) &&
        !originalRequest._retry &&
        originalRequest.url !== "/user/login" &&
        originalRequest.url !== "/user/resendmailverifytoken"
      ) {
        console.log("Access token expired, logging out");
        originalRequest._retry = true;
        logoutUser();
      }

      // For all other errors, log and reject
      console.error("Request failed:", {
        status: error.response?.status,
        url: originalRequest.url,
        message: error.message
      });
      return Promise.reject(error);
    }
  );

export default apiClient;
