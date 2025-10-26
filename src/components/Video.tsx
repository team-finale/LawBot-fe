
import { useNavigate } from "react-router-dom";
import "./Video.css";

const Videos = () => {
  const navigate = useNavigate();

  return (
    <section id="videos" className="videos-section">
      <h1 className="videos-title">이로운과 함께하는 최신 고용노동법 교육</h1>
      <p className="videos-subtitle">고용노동부의 최신 소식과 중요한 정보를 영상으로 쉽게 접할 수 있는 기회를 제공합니다</p>
      <button onClick={() => navigate("/video")} className="videos-button">
        새로운 소식 확인하기
      </button>
    </section>
  );
};

export default Videos;