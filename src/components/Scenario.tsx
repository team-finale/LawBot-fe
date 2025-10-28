
import { useNavigate } from "react-router-dom";
import "./Scenario.css";

const Scenario = () => {
  const navigate = useNavigate();

  return (
    <section id="scenarios" className="scenarios-section">
   
      <p className="scenarios-subtitle">실제 상황을 기반으로 한 문제를 풀어보세요</p>
      <button onClick={() => navigate("/scenarios")} className="scenarios-button">
        시나리오 퀴즈 풀기
      </button>
    </section>
  );
};

export default Scenario;
