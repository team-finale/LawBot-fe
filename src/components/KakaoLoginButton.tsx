import React from "react";
import { initKakao } from "../utils/kakaoLogin";
import axios from "axios";

declare global {
  interface Window {
    Kakao: any;
  }
}

const KakaoLoginButton: React.FC = () => {

  const handleLogin = () => {
    initKakao();

    window.Kakao.Auth.login({
      scope: "profile_nickname, account_email",
      success: async (authObj: any) => {
        const accessToken = authObj.access_token;
        try {
          const res = await axios.post("http://2lawon.com:8000/api/users/login/kakao", {
            access_token: accessToken,
            agree: true,
          });
          console.log("로그인 성공:", res.data);
          // 이후 token 저장, 페이지 이동 등 처리
        } catch (err: any) {
          console.error("서버 에러:", err.response?.data || err.message);
        }
      },
      fail: (err: any) => {
        console.error("카카오 로그인 실패:", err);
      },
    });
  };

  return (
    <button
      onClick={handleLogin}
      className="mt-4 inline-block px-6 py-3 bg-yellow-400 text-black rounded-full hover:bg-yellow-300 transition"
    >
      카카오로 로그인
    </button>
  );
};

export default KakaoLoginButton;