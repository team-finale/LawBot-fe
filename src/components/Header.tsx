export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full bg-white z-50 border-b border-gray-200">
      <div className="max-w-screen-xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* 로고 */}
        <div className="text-2xl font-semibold text-blue-600 tracking-tight">
          이로운
        </div>

        {/* 네비게이션 */}
        <nav className="flex space-x-8 text-sm font-medium text-gray-700">
          <a href="#features" className="hover:text-blue-500 transition">서비스</a>
          <a href="/gradio" className="hover:text-blue-500 transition">상담 시작하기</a>
          <a href="#faq" className="hover:text-blue-500 transition">FAQ</a>
          <a href="/login" className="hover:text-blue-500 transition">로그인</a>
        </nav>
      </div>
    </header>
  );
}