import { motion } from "framer-motion";
import KakaoLoginButton from "./KakaoLoginButton";

import worker1 from "../assets/images/worker1.png";
import worker2 from "../assets/images/worker2.png";
import worker3 from "../assets/images/worker3.png";

export default function Hero() {
  return (
    <section className="relative h-screen flex flex-col justify-center items-center px-6 bg-gradient-to-b from-[#FFFFFF] to-[#FFF8F0] overflow-hidden">
      
      {/* 🎨 3개 캐릭터 이미지: 일정 간격으로 가운데 정렬 */}
      <div className="absolute w-full h-full z-0 pointer-events-none opacity-90">
        <img
          src={worker1}
          alt="worker1"
          className="absolute top-1/2 left-[10%] w-[320px] -translate-y-1/2 object-contain"
        />
        <img
          src={worker2}
          alt="worker2"
          className="absolute top-1/2 left-[45%] w-[320px] -translate-y-1/2 object-contain"
        />
        <img
          src={worker3}
          alt="worker3"
          className="absolute top-1/2 right-[10%] w-[320px] -translate-y-1/2 object-contain"
        />
      </div>


      {/* 🎯 텍스트 콘텐츠 */}
      <div className="relative z-10 text-center max-w-xl">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0 }}
          className="text-4xl md:text-5xl font-bold leading-tight text-gray-900"
        >
          당신의 노동권,<br className="hidden md:block" />
          <span className="text-blue-600">AI 챗봇</span>으로 지켜드립니다.
        </motion.h1>
        <p className="text-gray-600 mt-4 text-base md:text-lg">
          부당해고, 임금 체불, 산업재해까지.<br className="hidden md:block" />
          전문가급 답변을 실시간으로 제공해 드립니다.
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
