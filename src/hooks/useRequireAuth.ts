// src/hooks/useRequireAuth.ts
import { useEffect, useState } from "react";

const KAKAO_START_URL = "https://2lawon.com/api/users/login/kakao";

export default function useRequireAuth() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      const rt = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.href = `${KAKAO_START_URL}?return_to=${rt}`;
      return;
    }
    setReady(true);
  }, []);

  return ready; // true가 되어야 화면 렌더
}
