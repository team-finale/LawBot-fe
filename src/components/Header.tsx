import { useEffect, useState } from "react";
import "./Header.css"; // ⬅️ 새 CSS 추가

export default function Header() {
  const [userName, setUserName] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("user_name");
    if (storedName) setUserName(storedName);
  }, []);

  // 내부/외부 라우팅이 섞여 있어 기존 <a> 유지
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_name");
    window.location.reload();
  };

  return (
    <header className="hd">
      <div className="hd__inner" role="navigation" aria-label="주요 메뉴">
        <a href="/" className="hd__logo" aria-label="이로운 홈">이로운</a>

        {/* Desktop Nav */}
        <nav className="hd__nav">
          {userName ? (
            <>
              <span className="hd__welcome">{userName}님 환영합니다</span>
              <button className="hd__link hd__link--ghost" onClick={handleLogout}>
                로그아웃
              </button>
            </>
          ) : (
            <a className="hd__link" href="https://2lawon.com/api/users/login/kakao">
              카카오 로그인
            </a>
          )}
          <a className="hd__link" href="/video">교육 시작하기</a>
          <a className="hd__link" href="/quiz/info">퀴즈 풀기</a>
          <a className="hd__link" href="/gradio">상담 시작하기</a>
          <a className="hd__link" href="/community">커뮤니티</a>

          {/* 언어 스위치 (토글 느낌) */}
          <div className="hd__lang" role="group" aria-label="언어 선택">
            <button className="hd__langBtn is-active" aria-pressed="true">한국어</button>
            <span className="hd__sep" aria-hidden>｜</span>
            <button className="hd__langBtn" aria-pressed="false" disabled>ENG</button>
          </div>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="hd__toggle"
          aria-label="메뉴 열기"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen(v => !v)}
        >
          <span className={`hd__bar ${open ? "is-open" : ""}`} />
        </button>
      </div>

      {/* Mobile Panel */}
      <div id="mobile-nav" className={`mnav ${open ? "is-open" : ""}`}>
        <div className="mnav__list">
          {userName ? (
            <>
              <div className="mnav__welcome">{userName}님 환영합니다</div>
              <button className="mnav__item" onClick={handleLogout}>로그아웃</button>
            </>
          ) : (
            <a className="mnav__item" href="https://2lawon.com/api/users/login/kakao">카카오 로그인</a>
          )}
          <a className="mnav__item" href="/video">교육 시작하기</a>
          <a className="mnav__item" href="/quiz/info">퀴즈 풀기</a>
          <a className="mnav__item" href="/gradio">상담 시작하기</a>
          <a className="mnav__item" href="/community">커뮤니티</a>

          <div className="mnav__lang" role="group" aria-label="언어 선택">
            <button className="mnav__langBtn is-active" aria-pressed="true">한국어</button>
            <button className="mnav__langBtn" aria-pressed="false" disabled>ENG</button>
          </div>
        </div>
      </div>
    </header>
  );
}
