import { motion } from "framer-motion";

const features = [
  "부당해고, 징계, 산업재해에 대한 실시간 상담",
  "노무사 연결 및 1:1 맞춤 법률 가이드 제공",
  "근로계약서 자동 분석 기능 제공 예정",
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-10">이런 기능을 제공합니다</h2>
      <div className="max-w-3xl mx-auto space-y-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-gray-700"
          >
            {feature}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
