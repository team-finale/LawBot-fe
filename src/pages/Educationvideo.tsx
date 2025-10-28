import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import useRequireAuth from "../hooks/useRequireAuth"; // ✅ 로그인 강제
import "./Educationvideo.css";

const MoELAiNotice = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          setError("로그인이 필요합니다.");
          return;
        }

        // 🎯 카카오 로그인된 유저만 영상 접근 가능
        const res = await axios.get(
          "http://2lawon.com:8000/api/video/stream/aiVideo.mp4",
          {
            headers: { Authorization: `Bearer ${token}` },
            responseType: "blob",
          }
        );

        const url = URL.createObjectURL(res.data);
        setVideoUrl(url);
      } catch (err: any) {
        console.error("비디오 요청 실패:", err);
        setError("영상 접근 권한이 없습니다. 로그인 상태를 확인해주세요.");
      }
    };

    fetchVideo();
  }, []);

  return (
    <section className="ai-video">
      <div className="ai-stage">
        <div className="ai-left">
          <h2 className="ai-title fade-up-delay">정책별 안내 - 고용</h2>
          <h1 className="ai-big fade-up-delay-2">
            청년일자리도약장려금 정책 안내 (25.10.24)
          </h1>
          <p className="ai-caption fade-up">
            고용노동부의 최신 소식을 쉽게 배우고, 실시간으로 업데이트된 정보를 영상으로 확인하세요.
          </p>

          {/* 🎬 비디오 */}
          <div className="video-container">
            {videoUrl ? (
              <video
                src={videoUrl}
                controls
                style={{
                  width: "80%",
                  maxWidth: "800px",
                  margin: "0 auto",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
            ) : error ? (
              <p className="text-red-600 mt-4 font-semibold">{error}</p>
            ) : (
              <p className="text-gray-500 mt-4">영상을 불러오는 중...</p>
            )}
          </div>

          {/* 요약 텍스트 */}
          <div className="video-summary fade-up-delay">
            <h3>청년 지원</h3>
            <p>
              청년이 고용된 후, <strong>최대 60만 원씩 12개월 동안, 최대 720만 원 지원</strong>
              <br />
              기업은 청년 채용 후 6개월 근속 시 <strong>최대 480만 원 지원</strong>
            </p>
          </div>

          {/* 자세히 보기 */}
          <div className="ai-controls">
            <a
              className="btn-primary"
              href="https://www.moel.go.kr/board/view?menuId=MENU002050300000000&regNo=5wb95PGMJ7&bbsId=BOARD00006"
              target="_blank"
              rel="noreferrer"
            >
              자세히 보기
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const EducationVideo = () => {
  useRequireAuth(); // ✅ 로그인 필수

  return (
    <div className="min-h-[100dvh] bg-white">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-neutral-200">
        <Header />
      </div>

      <main className="content">
        <div className="ai-video">
          <MoELAiNotice />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EducationVideo;
