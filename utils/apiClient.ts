import axios from "axios";

interface AuthTokens {
  access_token: string;
  refresh_token: string;
}


const apiClient = axios.create({
  baseURL: "https://api-prod.aio.events/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
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


apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const authTokensString = localStorage.getItem("authTokens");
        if (!authTokensString) {
          throw new Error("No auth tokens found");
        }

        const authTokens: AuthTokens = JSON.parse(authTokensString);

        const response = await axios.post(
          "https://api-prod.aio.events/api/user/token",
          {
            refresh_token: authTokens.refresh_token,
          },
          { withCredentials: true }
        );

        const newTokens: AuthTokens = {
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token || authTokens.refresh_token,
        };

        localStorage.setItem("authTokens", JSON.stringify(newTokens));
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${newTokens.access_token}`;
        originalRequest.headers.Authorization = `Bearer ${newTokens.access_token}`;

        processQueue(null, newTokens.access_token);
        isRefreshing = false;

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
