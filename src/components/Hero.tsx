import { motion } from "framer-motion";
import KakaoLoginButton from "./KakaoLoginButton";
import worker1 from "../assets/images/worker1.png";
import worker2 from "../assets/images/worker2.png";
import worker3 from "../assets/images/worker3.png";

export default function Hero() {
  return (
    <section className="hero-section">
      {/* 캐릭터 이미지 배치 */}
      <div className="hero-images">
        <img src={worker1} alt="worker1" className="worker worker1" />
        <img src={worker2} alt="worker2" className="worker worker2" />
        <img src={worker3} alt="worker3" className="worker worker3" />
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
          부당해고, 임금 체불, 산업재해, 부당한 문서 파악까지.<br />
          이로운은 언제나 기다리고 있어요
        </p>
        <KakaoLoginButton />
      </div>
    </section>
  );
}
