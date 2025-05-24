import { useEffect, useState } from "react";
import axios from "axios";
import MyInfoPage from "./LoginSuccess";

const KakaoRedirectPage = () => {
  const [tokenReady, setTokenReady] = useState(false);

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (!code) return;

    axios
      .get("http://2lawon.com/api/users/login/kakao/callback", {
        params: { code, agree: true },
      })
      .then((res) => {
        const token = res.data.access_token;
        localStorage.setItem("access_token", token);
        setTokenReady(true); // ✅ 이제 MyInfoPage 보여줄 수 있음
      })
      .catch((err) => {
        console.error("로그인 실패:", err);
      });
  }, []);

  if (!tokenReady) return <p>로그인 중입니다...</p>;

   return (
    <div className="text-center mt-10">
      <MyInfoPage />
      <a
        href="https://2lawon.com"
        className="mt-6 inline-block px-6 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition"
      >
        시작하기
      </a>
    </div>
  );
};

export default KakaoRedirectPage;
