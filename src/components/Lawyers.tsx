
import { useNavigate } from "react-router-dom";
import "./lawyers.css";

const Lawyer = () => {
  const navigate = useNavigate();

  return (
    <section id="lawyers" className="lawyers-section">
      <h1 className="lawyers-title">이로운과 학습해요</h1>
      <p className="lawyers-subtitle">퀴즈를 통해 학습을 시작해보세요</p>
      <button onClick={() => navigate("/quiz/info")} className="lawyers-button">
        퀴즈풀기
      </button>
    </section>
  );
};

export default Lawyer;
