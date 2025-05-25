import { useEffect } from "react";

const KakaoRedirectPage = () => {
  useEffect(() => {
    const params = new URL(window.location.href).searchParams;
    const token = params.get("access_token");
    const user_id = params.get("user_id");
    const user_name = params.get("user_name");

    if (!token || !user_id || !user_name) {
      alert("로그인 정보가 누락되었습니다.");
      window.location.href = "/";
      return;
    }

    // ✅ 서버가 넘긴 정보를 저장
    localStorage.setItem("access_token", token);
    localStorage.setItem("user_id", user_id);
    localStorage.setItem("user_name", user_name);

    alert(`${user_name}님 로그인되었습니다.`);
    window.location.href = "/";
  }, []);

  return <p style={{ textAlign: "center", marginTop: "100px" }}>로그인 처리 중입니다...</p>;
};

export default KakaoRedirectPage;
