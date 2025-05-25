import { useEffect, useState } from "react";
import api from "../api/api";
import Header from "../components/Header";
import Footer from "../components/Footer";
export default function MyInfoPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    api
      .get("/users/me")
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.error("인증 실패:", err);
      });
  }, []);

  if (!user) return <p>로딩 중...</p>;

 return (
  <>
    <Header/>
    <div className="content">
      <h2>내 정보</h2>
      <p>이름: {user.name}</p>
      <p>유저 ID: {user.user_id}</p>
      <p>FCM 토큰: {user.fcm_token ?? "없음"}</p>
    </div>
    <Footer/>
  </>
);
}
