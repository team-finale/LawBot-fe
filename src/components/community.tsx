import { useNavigate } from "react-router-dom";
import "./community.css";

const Community = () => {
  const navigate = useNavigate();

  return (
    <section id="community" className="community-section">
      <h1 className="community-title">이로운에 오신 것을 환영합니다!</h1>
      <p className="community-subtitle">노무사 인증을 통해 전문가 서비스를 시작하세요.</p>
      <button onClick={() => navigate("/community")} className="community-button">
        커뮤니티
      </button>
    </section>
  );
};

export default Community;