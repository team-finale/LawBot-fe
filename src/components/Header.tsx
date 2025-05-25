import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; 

interface DecodedToken {
  user_id: number;
  user_name: string;
  exp: number;
  sub: string;
}

export default function Header() {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setUserName(decoded.user_name);
      } catch (err) {
        console.error("토큰 디코딩 실패", err);
      }
    }
  }, []);

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">이로운</div>

        <nav className="nav">
          {userName ? (
            <>
              <span>{userName}님 환영합니다</span>
              <a href="#" onClick={() => {
                localStorage.removeItem("access_token");
                window.location.reload();
              }}>로그아웃</a>
            </>
          ) : (
            <a href="http://2lawon.com:8000/api/users/login/kakao">카카오 로그인</a>
          )}
          <a href="/gradio">상담 시작하기</a>
          <a href="/lawyer-verification">노무사 인증</a>
          <a href="/community">커뮤니티</a>
          <div className="lang">
            <span>한국어</span>
            <span>|</span>
            <span>ENG</span>
          </div>
        </nav>
      </div>
    </header>
  );
}
