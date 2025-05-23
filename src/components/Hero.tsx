import { motion } from "framer-motion";
import KakaoLoginButton from "./KakaoLoginButton";


export default function Hero() {
  return (
    <section className="h-screen flex flex-col md:flex-row justify-center items-center gap-10 bg-gradient-to-b from-white to-blue-50 px-6 text-center md:text-left">
      <div className="max-w-xl">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold leading-tight text-gray-900"
        >
          당신의 노동권,<br className="hidden md:block" />
          <span className="text-blue-600">AI 챗봇</span>으로 지켜드립니다.
        </motion.h1>
        <p className="text-gray-600 mt-4 text-base md:text-lg">
          부당해고, 임금 체불, 산업재해까지.<br className="hidden md:block" /> 전문가급 답변을 실시간으로 제공해 드립니다.
        </p>
        <a
          href="/gradio"
          className="mt-8 inline-block px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
        >
          지금 상담 시작하기
        </a>
         <KakaoLoginButton />
      </div>

    
    </section>
  );
}
