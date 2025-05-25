import { useEffect, useState } from "react";

export default function Header() {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const storedName = localStorage.getItem("user_name");
    if (storedName) {
      setUserName(storedName);
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
              <a
                href="#"
                onClick={() => {
                  localStorage.removeItem("access_token");
                  localStorage.removeItem("user_name");
                  window.location.reload();
                }}
              >
                로그아웃
              </a>
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
