export default function Footer() {
  return (
    <footer
      className="
        footer
        w-full
        bg-gray-50
        border-t border-gray-200
        py-6 sm:py-8
        px-4 sm:px-6 lg:px-8
        text-center sm:text-left
      "
    >
      <div className="mx-auto max-w-screen-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <p className="footer-text text-sm sm:text-base text-gray-600 leading-relaxed">
          © 2025 Finale | 이로운：취약 노동자를 위한 AI 고용노동 퀴즈 학습 플랫폼
        </p>

        <div className="footer-links flex justify-center sm:justify-end gap-4 text-sm sm:text-base">
          <a href="#" className="hover:underline text-gray-700">
            이용약관
          </a>
        </div>
      </div>
    </footer>
  );
}
