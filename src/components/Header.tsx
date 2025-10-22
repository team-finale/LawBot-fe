import { useEffect, useState, useCallback } from "react";

export default function Header() {
  const [userName, setUserName] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("user_name");
    if (storedName) setUserName(storedName);
  }, []);

  // 로그아웃
  const handleLogout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_name");
    window.location.reload();
  }, []);

  // ESC로 모바일 메뉴 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // 링크 클릭 시 모바일 메뉴 닫기
  const closeAfter = (fn?: () => void) => () => {
    setOpen(false);
    fn?.();
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* 로고 */}
        <a href="/" className="text-xl font-semibold tracking-tight">
          이로운
        </a>

        {/* 데스크톱 네비게이션 */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {userName ? (
            <>
              <span className="text-gray-700">{userName}님 환영합니다</span>
              <button
                onClick={handleLogout}
                className="rounded-lg border px-3 py-1.5 hover:bg-gray-50"
              >
                로그아웃
              </button>
            </>
          ) : (
            <a
              className="rounded-lg border px-3 py-1.5 hover:bg-gray-50"
              href="https://2lawon.com/api/users/login/kakao"
              rel="noopener noreferrer"
            >
              카카오 로그인
            </a>
          )}

          <a className="hover:underline underline-offset-4" href="/video">교육 시작하기</a>
          <a className="hover:underline underline-offset-4" href="/quiz/info">퀴즈 풀기</a>
          <a className="hover:underline underline-offset-4" href="/gradio">상담 시작하기</a>
          <a className="hover:underline underline-offset-4" href="/community">커뮤니티</a>

          <div className="ml-2 flex items-center gap-2 text-xs text-gray-600">
            <span className="rounded-full border px-2 py-0.5">한국어</span>
            <span>|</span>
            <span>ENG</span>
          </div>
        </nav>

        {/* 모바일: 햄버거 버튼 */}
        <button
          className="md:hidden inline-flex items-center justify-center rounded-lg p-2 hover:bg-gray-100"
          aria-label="메뉴 열기"
          aria-controls="mobile-menu"
          aria-expanded={open}
          onClick={() => setOpen(v => !v)}
        >
          {/* 아이콘: 햄버거 / X (SVG로 의존성 없이) */}
          {open ? (
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
          <span className="sr-only">{open ? "메뉴 닫기" : "메뉴 열기"}</span>
        </button>
      </div>

      {/* 모바일 드로어 */}
      {open && (
        <div id="mobile-menu" className="md:hidden border-t bg-white">
          <div className="mx-auto max-w-screen-xl px-4 py-3">
            <div className="flex flex-col gap-3 text-sm">
              {userName ? (
                <>
                  <span className="text-gray-700">{userName}님 환영합니다</span>
                  <button
                    onClick={closeAfter(handleLogout)}
                    className="w-full rounded-lg border px-3 py-2 text-left hover:bg-gray-50"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <a
                  href="https://2lawon.com/api/users/login/kakao"
                  rel="noopener noreferrer"
                  className="w-full rounded-lg border px-3 py-2 hover:bg-gray-50"
                  onClick={closeAfter()}
                >
                  카카오 로그인
                </a>
              )}
              <a className="rounded-lg px-3 py-2 hover:bg-gray-50" href="/video" onClick={closeAfter()}>교육 시작하기</a>
              <a className="rounded-lg px-3 py-2 hover:bg-gray-50" href="/quiz/info" onClick={closeAfter()}>퀴즈 풀기</a>
              <a className="rounded-lg px-3 py-2 hover:bg-gray-50" href="/gradio" onClick={closeAfter()}>상담 시작하기</a>
              <a className="rounded-lg px-3 py-2 hover:bg-gray-50" href="/community" onClick={closeAfter()}>커뮤니티</a>

              <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
                <span className="rounded-full border px-2 py-0.5">한국어</span>
                <span>|</span>
                <span>ENG</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
