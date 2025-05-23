export default function CTA() {
  return (
    <section id="chat" className="py-20 bg-blue-600 text-white text-center">
      <h2 className="text-3xl font-bold mb-4">지금 무료로 상담 받아보세요</h2>
      <p className="mb-6">AI 챗봇과 함께 노동법률 문제를 해결해보세요.</p>
      <a
        href="/gradio"
        className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-full hover:bg-blue-100 transition"
      >
        상담 시작하기
      </a>
    </section>
  );
}
