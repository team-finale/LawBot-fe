
import KakaoLoginButton from "./KakaoLoginButton";
import "./Kakao.css"

const Kakao = () => {
 

  return (
    <section id="kako" className="kakao-section">

      <h1 className="kakao-title">간편 로그인으로 시작해요</h1>
      <p className="kakao-subtitle">카카오로그인으로 쉽고 빠르게 시작해보세요 </p>
    <KakaoLoginButton/>
    </section>
    
  );
};

export default Kakao;

