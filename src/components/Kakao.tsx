
import KakaoLoginButton from "./KakaoLoginButton";

const Kakao = () => {
 

  return (
    <section id="kako" className="text-center bg-[#f9fafb]py-20">

      <h1 className="text-4xl font-bold mb-4">간편 로그인으로 시작해요</h1>
      <p className="text-lg mb-6">카카오로그인으로 쉽고 빠르게 시작해보세요 </p>
       <KakaoLoginButton/>
    </section>
    
  );
};

export default Kakao;
