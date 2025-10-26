
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Educationvideo.css"; // ✅ 커스텀 CSS 임포트

type MoELAiNoticeProps = {
  videoSrc?: string; // 비디오 소스 경로
};

const MoELAiNotice = ({
  videoSrc = "/src/assets/videos/edu.mp4", // 비디오 파일 경로
}: MoELAiNoticeProps) => {
  return (
    <section className="ai-video">
      <div className="ai-stage">
        {/* LEFT: 텍스트/컨트롤 */}
        <div className="ai-left">
          <h2 className="ai-title fade-up-delay">정책별 안내-고용</h2>
          <h1 className="ai-big fade-up-delay-2">청년일자리도약장려금 정책 안내 (25.10.24)</h1>
          <p className="ai-caption fade-up">
            고용노동부의 최신 소식을 쉽게 배우고, 실시간으로 업데이트된 정보를 영상으로 확인하세요.
          </p>

          {/* 비디오 플레이어 */}
          <div className="video-container">
            <video
              src={videoSrc}
              controls
              style={{ width: "80%", maxWidth: "800px", margin: "0 auto" }}
            />
          </div>

          {/* 간단한 요약 텍스트 */}
          <div className="video-summary fade-up-delay">
            <h3>청년 지원</h3>
            <p>
              청년이 고용된 후, <strong>최대 60만 원씩 12개월 동안, 최대 720만 원 지원</strong>
              <br />
              기업은 청년 채용 후 6개월 근속 시 <strong>최대 480만 원 지원</strong>
            </p>
          </div>

          {/* 자세히 보기 버튼 */}
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
