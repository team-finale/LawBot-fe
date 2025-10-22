import { motion } from "framer-motion";
import "./Features.css";

export default function Features() {
  return (
    <section
      className="
        alt-sections
        mx-auto max-w-screen-xl
        px-4 sm:px-6 lg:px-8
        py-12 sm:py-16
      "
    >
      {/* 섹션 1 */}
      <motion.div
        className="alt-row"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true, amount: 0.35 }}
      >
        <div className="alt-text">
          <p className="alt-subtitle">😊 법률 접근성 향상</p>
          <h2 className="alt-title">
            복잡한 노동 법률 절차에 대한 <br />부담을 줄이는 이로운
          </h2>
          <p className="alt-description">
            법률 퀴즈를 통해,<br />
            노동자가 어렵게 느끼는 법적 개념을<br />
            쉽고 재밌게 익히는 서비스 제공
          </p>
        </div>
      </motion.div>

      {/* 섹션 2 */}
      <motion.div
        className="alt-row reverse"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.35 }}
      >
        <div className="alt-text">
          <p className="alt-subtitle">🔥 사회적 분쟁 비용 절감</p>
          <h2 className="alt-title">
            분쟁 예방을 통한 <br />
            사회적 갈등 비용 절감의 이로운
          </h2>
          <p className="alt-description">
            실시간 법률 상담을 통한 문제 해결을 통해,<br />
            고용노동 민원의 1차 사전 해결율 제고
          </p>
        </div>
      </motion.div>

      {/* 섹션 3 */}
      <motion.div
        className="alt-row"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true, amount: 0.35 }}
      >
        <div className="alt-text">
          <p className="alt-subtitle">✨ 노동권 보호</p>
          <h2 className="alt-title">
            실시간으로 쉽게<br />
            접근할 수 있는 이로운
          </h2>
          <p className="alt-description">
            취약 노동자들이 실시간으로 권리 침해를 파악하고,<br />
            후속 절차를 안내받을 수 있는 학습 서비스 제공
          </p>
        </div>
      </motion.div>

      {/* 마지막 강조 문장 */}
      <motion.div
        className="alt-row center-text"
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9 }}
        viewport={{ once: true, amount: 0.35 }}
      >
        <h2 className="alt-title">
          퀴즈 학습을 통해 노동법을 누구나 쉽고 재밌게 학습할 수 있도록,
          <br />
          권리 보호와 예방을 자동화하는 플랫폼
        </h2>
      </motion.div>
    </section>
  );
}
