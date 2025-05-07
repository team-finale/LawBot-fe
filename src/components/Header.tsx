export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full bg-white z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-blue-600">노동권챗봇</div>
        <nav className="space-x-6 text-gray-700">
          <a href="#features" className="hover:text-blue-500">서비스</a>
          <a href="#chat" className="hover:text-blue-500">상담하기</a>
          <a href="#faq" className="hover:text-blue-500">FAQ</a>
          <a href="/login" className="hover:text-blue-500">로그인</a>
        </nav>
      </div>
    </header>
  );
}
