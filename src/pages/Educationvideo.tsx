import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Educationvideo.css"; // ✅ 커스텀 CSS 임포트

type MoELAiNoticeProps = {
  videoSrc?: string; // 비디오 소스 경로
};

const MoELAiNotice = ({
  videoSrc = "/src/assets/videos/edu.mp4", // 비디오 파일 경로 수정
}: MoELAiNoticeProps) => {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="ai-video">
      <div className="ai-stage">
        {/* LEFT: 텍스트/컨트롤 */}
        <div className="ai-left">
          <h2 className="ai-title fade-up-delay">교육 영상</h2>
          <h1 className="ai-big fade-up-delay-2">노동법 교육</h1>
          <p className="ai-caption fade-up">이 영상은 노동법 교육을 다룹니다.</p>

          {/* Controls */}
          <div className="ai-controls">
            <button
              className="btn-outline"
              onClick={() => setPlaying((prev) => !prev)}
            >
              {playing ? "일시정지" : "재생"}
            </button>

            <button className="btn-outline" onClick={() => setPlaying(false)}>
              멈추기
            </button>
          </div>

          {/* 비디오 플레이어 */}
          <div className="video-container">
            <video
              src={videoSrc}
              controls
              autoPlay={playing}
              style={{ width: "100%" }}
            />
          </div>
        </div>

        {/* RIGHT: 비주얼(Stage) */}
        <div className="ai-right">
          {/* 배지 카드 */}
          <div className="badge-card" aria-hidden>
            <div className="badge-small">Scene</div>
            <div className="badge-big">1 / 1</div>
          </div>
        </div>
      </div>
    </section>
  );
};

const EducationVideo = () => {
  return (
    <div className="min-h-[100dvh] bg-white">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-neutral-200">
        <Header />
      </div>

      <main className="content">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-900">
          이로운과 함께하는 노동법 교육
        </h1>
        <p className="mt-2 text-neutral-600">교육 영상을 통해 실생활 속 노동법을 이해하고 익혀보세요.</p>

        <div className="ai-video">
          <MoELAiNotice />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EducationVideo;
