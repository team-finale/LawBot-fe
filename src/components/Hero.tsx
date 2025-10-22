import { motion } from "framer-motion";
import "./Hero.css";
import KakaoLoginButton from "./KakaoLoginButton";
import worker1 from "../assets/images/worker1.png";
import worker2 from "../assets/images/worker2.png";
import worker3 from "../assets/images/worker3.png";

const float = (delay = 0, distance = 14, rotate = 2, duration = 3.6) => ({
  initial: { y: 0, rotate: 0 },
  animate: {
    y: [0, -distance, 0],
    rotate: [0, rotate, 0],
    transition: { duration, repeat: Infinity, ease: "easeInOut", delay },
  },
  whileHover: { scale: 1.03, rotate: 0.5 },
});

export default function Hero() {
  return (
    <section
      className="
        hero-section
        mx-auto max-w-screen-xl
        px-4 sm:px-6 lg:px-8
        py-10 sm:py-16
      "
    >
      {/* 이미지/텍스트 2열 그리드 (모바일 1열) */}
      <div className="hero-grid">
        {/* 캐릭터 이미지 배치 */}
        <div className="hero-images">
          <motion.img
            src={worker1}
            alt=""
            aria-hidden="true"
            className="worker worker1"
            {...float(0.0, 16, 2.5, 3.8)}
          />
          <motion.img
            src={worker2}
            alt=""
            aria-hidden="true"
            className="worker worker2"
            {...float(0.6, 12, 2.0, 3.2)}
          />
          <motion.img
            src={worker3}
            alt=""
            aria-hidden="true"
            className="worker worker3"
            {...float(1.2, 18, 3.0, 4.2)}
          />
        </div>

        {/* 텍스트 콘텐츠 */}
        <div className="hero-text">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0 }}
            className="hero-title"
          >
            당신의 노동권,<br />
            <span className="highlight">이로운</span>이 지켜드릴게요
          </motion.h1>

          <p className="hero-subtitle">
            부당해고, 임금 체불, 산업재해
            <br />
            이로운과 함께 쉽고 재밌게 학습해봐요!
          </p>

          <div className="hero-cta">
            <KakaoLoginButton />
          </div>
        </div>
      </div>
    </section>
  );
}
