import { useNavigate } from "react-router-dom";
import "./gradio.css"
const Gradio = () => {
  const navigate = useNavigate();

  return (
    <section id="gradio" className="gradio-section">
      <h1 className="gradio-title">이로운에게 물어보세요</h1>
      <p className="gradio-subtitle">RAG 활용 챗봇이 빠르고 쉽게 알려드릴게요</p>
       <button onClick={() => navigate("/gradio")} className="gradio-button"> 이로운에게 물어보기</button>
    </section>
    
  );
};

export default Gradio;

