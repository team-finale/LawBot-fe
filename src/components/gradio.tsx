import { useNavigate } from "react-router-dom";

const Gradio = () => {
  const navigate = useNavigate();

  return (
    <section id="lawyers" className="text-center bg-[#f9fafb]py-20">
      <h1 className="text-4xl font-bold mb-4">이로운에게 물어보세요</h1>
      <p className="text-lg mb-6">RAG 활용 챗봇이 빠르고 쉽게 알려드릴게요</p>
       <button onClick={() => navigate("/gradio")}
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
        이로운에게 물어보기
      </button>
    </section>
    
  );
};

export default Gradio;
