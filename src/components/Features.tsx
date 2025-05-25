import { motion } from "framer-motion";

const features = [
  "LLM과 RAG 챗봇 활용한 부당해고, 징계, 산업재해에 대한 실시간 법률 자문",
  "OCR 활용 부당한 계약서 식별",
  "자문 내용 기반 사용자맞춤 전문 노무사 매칭",
  "법률 퀴즈",
];

export default function Features() {
  return (
    <section id="features" className="bg-[#ffffff] py-24 px-6">

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        
        {/* 왼쪽 텍스트 영역 */}
        <div className="flex-1 text-left">
          <p className="text-blue-600 font-semibold text-sm mb-2">💼 주요 기능</p>
          <h2 className="text-4xl font-bold mb-6 leading-snug">
            이로운이 제공하는<br />
            핵심 서비스입니다
          </h2>
          <p className="text-gray-600 mb-8">
            근로자가 겪는 다양한 노동 문제에 대해<br />
            실시간 상담과 법률 가이드를 제공합니다.
          </p>

          <div className="space-y-5">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-base text-gray-700 leading-relaxed"
              >
                ✅ {feature}
              </motion.div>
            ))}
          </div>
        </div>

        {/* 오른쪽 시각 카드 영역 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex-1 max-w-md w-full bg-white rounded-xl shadow-xl p-8 text-center"
        >
          <div className="text-blue-500 text-3xl mb-4">📘</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            법률 서비스 통합 지원
          </h3>
          <p className="text-gray-600 text-sm">
            이로운은 근로자의 권리를 지키기 위한 실질적 도움을 제공합니다.
          </p>
        </motion.div>
      </div>
      
    </section>
  );
}
