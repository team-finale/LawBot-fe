import React from "react";

//const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID;
//const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

const KakaoLoginButton: React.FC = () => {
  const handleLogin = () => {
    window.location.href = "http://2lawon.com:8000/api/users/login/kakao";
  };

  return (
    <button
      onClick={handleLogin}
      className="mt-4 inline-block px-6 py-3 bg-yellow-400 text-black rounded-full hover:bg-yellow-300 transition"
    >
      카카오로 시작하기
    </button>
  );
};

export default KakaoLoginButton;