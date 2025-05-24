import { useNavigate } from "react-router-dom";

const Lawyer = () => {
  const navigate = useNavigate();

  return (
    <section id="lawyers" className="text-center py-20">
      <h1 className="text-4xl font-bold mb-4">이로운에 오신 것을 환영합니다!</h1>
      <p className="text-lg mb-6">노무사 인증을 통해 전문가 서비스를 시작하세요.</p>
      <button
        onClick={() => navigate("/lawyer-verification")}
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        노무사 인증하기
      </button>
    </section>
  );
};

export default Lawyer;
