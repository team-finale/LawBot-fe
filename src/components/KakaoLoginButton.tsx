import React from "react";
import "./KakaoButton.css"; // 버튼 전용 스타일 분리 추천

const KakaoLoginButton: React.FC = () => {
  const handleLogin = () => {
    window.location.href = "api/users/login/kakao";
  };

  return (
    <button onClick={handleLogin} className="button-kakao">
      카카오로 시작하기
    </button>
  );
};

export default KakaoLoginButton;
