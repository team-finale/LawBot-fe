
import { useNavigate } from "react-router-dom";
import "./Education.css";

const Education = () => {
  const navigate = useNavigate();

  return (
    <section id="educations" className="educations-section">
      <h1 className="educations-title">노동법, 이제 어렵지 않아요</h1>
      <p className="educations-subtitle">이로운의 퀴즈로 쉽고 재미있게 학습을 시작해보세요</p>
      <button onClick={() => navigate("/quiz/info")} className="educations-button">
        퀴즈 풀기
      </button>
    </section>
  );
};

export default Education;
