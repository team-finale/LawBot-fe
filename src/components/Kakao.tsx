import KakaoLoginButton from "./KakaoLoginButton";
import "./Kakao.css";

const Kakao = () => {
  return (
    <section
      id="kakao"
      className="
        kakao-section
        mx-auto max-w-screen-md
        px-4 sm:px-6 lg:px-8
        py-12 sm:py-16
      "
    >
      <h1 className="kakao-title">간편 로그인으로 시작해요</h1>
      <p className="kakao-subtitle">
        카카오 로그인으로 쉽고 빠르게 시작해보세요
      </p>
      <div className="kakao-btn-wrap">
        <KakaoLoginButton />
      </div>
    </section>
  );
};

export default Kakao;
