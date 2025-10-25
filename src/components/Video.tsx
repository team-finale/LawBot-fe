
import { useNavigate } from "react-router-dom";
import "./Video.css";

const Videos = () => {
  const navigate = useNavigate();

  return (
    <section id="videos" className="videos-section">
      <h1 className="videos-title">이로운과 함께하는 노동법 교육</h1>
      <p className="videos-subtitle">교육 영상을 통해 실생활 속 노동법을 이해하고 익혀보세요</p>
      <button onClick={() => navigate("/video")} className="videos-button">
        교육 영상 학습하기
      </button>
    </section>
  );
};

export default Videos;