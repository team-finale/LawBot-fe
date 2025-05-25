export default function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">이로운</div>

        <nav className="nav">
          <a href="http://2lawon.com:8000/api/users/login/kakao">카카오 로그인</a>
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
