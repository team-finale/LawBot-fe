export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full bg-white z-50">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-6 py-4 text-sm text-gray-800">
        <div className="text-lg font-bold text-blue-600">이로운</div>

        <nav className="flex items-center space-x-6">
          <a href="/gradio" className="hover:text-black no-underline transition">카카오 로그인</a>
          <a href="/gradio" className="hover:text-black no-underline transition">상담 시작하기</a>
          <a href="#faq" className="hover:text-black no-underline transition">자주 묻는 질문</a>
          <a href="/login" className="hover:text-black no-underline transition">로그인</a>

          <div className="flex items-center space-x-1 text-gray-400 text-xs pl-4 border-l border-gray-300">
            <span className="hover:text-black cursor-pointer">한국어</span>
            <span>|</span>
            <span className="hover:text-black cursor-pointer">ENG</span>
          </div>
        </nav>
      </div>
    </header>
  );
}
