/*import { useNavigate } from "react-router-dom";*/
import "./gradio.css"
const Gradio = () => {
  /*const navigate = useNavigate();*/

  return (
    <section id="gradio" className="gradio-section">
      <h1 className="gradio-title">이로운에게 물어보세요</h1>
      <p className="gradio-subtitle">LLM+RAG 기반 챗봇이 빠르고 쉽게 알려드릴게요</p>
       <a href="/gradio" className="gradio-button">이로운에게 물어보기</a>
    </section>
    
  );
};

export default Gradio;

