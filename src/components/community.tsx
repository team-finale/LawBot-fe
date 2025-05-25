import { useNavigate } from "react-router-dom";
import "./community.css";

const Community = () => {
  const navigate = useNavigate();

  return (
    <section id="community" className="community-section">
      <h1 className="community-title">함께 나누고, 함께 이겨내요</h1>
      <p className="community-subtitle">작은 이야기 하나도 누군가에겐 큰 힘이 되니까요</p>
      <button onClick={() => navigate("/community")} className="community-button">
        커뮤니티
      </button>
    </section>
  );
};

export default Community;