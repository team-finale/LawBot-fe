
import { useNavigate } from "react-router-dom";
import "./lawyers.css";

const Lawyer = () => {
  const navigate = useNavigate();

  return (
    <section id="lawyers" className="lawyers-section">
      <h1 className="lawyers-title">이로운에 오신 것을 환영합니다!</h1>
      <p className="lawyers-subtitle">노무사 인증을 통해 전문가 서비스를 시작하세요.</p>
      <button onClick={() => navigate("/lawyer-verification")} className="lawyers-button">
        노무사 인증
      </button>
    </section>
  );
};

export default Lawyer;
