export const initKakao = () => {
  if (!window.Kakao?.isInitialized()) {
    window.Kakao.init(import.meta.env.VITE_KAKAO_JS_KEY); // .env에서 관리 추천
  }
};