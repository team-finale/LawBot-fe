// src/utils/api.ts
import axios from "axios";

const KAKAO_START_URL = "https://2lawon.com/api/users/login/kakao";

const api = axios.create({
  baseURL: "https://2lawon.com/api", // ✅ 서버 base URL
  headers: { "Content-Type": "application/json" },
});

// ✅ 요청 인터셉터(모든 요청에 토큰 자동 추가)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ 응답 인터셉터(401이면 카카오 로그인으로 이동)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      const rt = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.href = `${KAKAO_START_URL}?return_to=${rt}`;
      return Promise.resolve(null as any);
    }
    return Promise.reject(err);
  }
);

export default api;
