// src/pages/EducationVideo.tsx
import "./Educationvideo.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useMemo, useRef, useState } from "react";

type Scene = { title: string; big: string; caption: string };

const MoELAiNotice = ({
  ctaHref = "https://www.moel.go.kr",
  datesPhrase = "9.25(목)~9.28(일)",
  contact = "고객상담센터(국번없이 1350), 관할 지방관서",
}: {
  ctaHref?: string;
  datesPhrase?: string;
  contact?: string;
}) => {
  const scenes: Scene[] = useMemo(
    () => [
      {
        title: "임금체불·산업안전보건법 위반 등",
        big: "신고사건 재신청 안내",
        caption:
          "화재발생 전후 노동포털에서 신고사건을 신청하신 분은 접수여부를 확인하고, 미접수 시 재신청해 주세요.",
      },
      {
        title: "확인 기간",
        big: datesPhrase,
        caption:
          "해당 기간 중 신청하신 건은 시스템 이슈로 누락 가능성이 있어 접수여부 확인이 필요합니다.",
      },
      {
        title: "확인 방법",
        big: "노동포털 접수여부 확인",
        caption:
          "노동포털 마이페이지에서 접수상태를 확인한 뒤, 미접수 건은 즉시 재신청해 주세요.",
      },
      {
        title: "문의처",
        big: contact,
        caption:
          "전화 연결이 어려울 경우 가까운 지방관서를 방문하거나 온라인 상담 게시판을 이용해 주세요.",
      },
    ],
    [datesPhrase, contact]
  );

  // state
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  // speech
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") synthRef.current = window.speechSynthesis;
    return () => {
      if (synthRef.current) synthRef.current.cancel();
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  const speak = (text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ko-KR";
    u.rate = 1.0;
    u.pitch = 1.0;
    u.volume = muted ? 0 : 1;
    utterRef.current = u;
    synthRef.current.speak(u);
  };

  // auto-advance per scene (6s)
  useEffect(() => {
    if (!playing) return;

    const s = scenes[index];
    speak(`${s.title}. ${s.big}. ${s.caption}`);

    const total = 6000;
    const started = Date.now();
    setProgress((index / scenes.length) * 100);

    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - started;
      const pctWithin = Math.min(1, elapsed / total);
      const base = (index / scenes.length) * 100;
      const within = (1 / scenes.length) * pctWithin * 100;
      setProgress(base + within);

      if (pctWithin >= 1) {
        window.clearInterval(timerRef.current!);
        if (index < scenes.length - 1) setIndex((i) => i + 1);
        else setPlaying(false);
      }
    }, 50);
  }, [index, playing, muted, scenes]);

  const current = scenes[index];

  return (
    <section className="ai-video">
      <div className="ai-stage">
        {/* LEFT TEXT */}
        <div className="ai-left">
          <h2 className="ai-title fade-up">{current.title}</h2>
          <h1 className="ai-big fade-up-delay">{current.big}</h1>
          <p className="ai-caption fade-up-delay-2">{current.caption}</p>

          <div className="ai-controls">
            <button
              className="btn-outline"
              onClick={() => {
                if (!playing) setPlaying(true);
                else {
                  setPlaying(false);
                  if (synthRef.current) synthRef.current.cancel();
                  if (timerRef.current) window.clearInterval(timerRef.current);
                }
              }}
            >
              {playing ? "일시정지" : "재생"}
            </button>
            <button
              className="btn-outline"
              onClick={() => setMuted((m) => !m)}
            >
              {muted ? "음소거 해제" : "음소거"}
            </button>
            <button
              className="btn-outline"
              onClick={() => {
                setIndex(0);
                setProgress(0);
                setPlaying(true);
              }}
            >
              다시 보기
            </button>
            <a className="btn-primary" href={ctaHref} target="_blank" rel="noreferrer">
              자세히 보기
            </a>
          </div>

          {/* stepper */}
          <div className="ai-stepper" aria-label="장면 이동">
            {scenes.map((_, i) => (
              <button
                key={i}
                className={`ai-step ${i <= index ? "is-active" : ""}`}
                onClick={() => setIndex(i)}
                aria-label={`장면 ${i + 1}`}
              />
            ))}
          </div>

          {/* overall progress */}
          <div className="ai-progress">
            <div className="ai-progress-bar" style={{ width: `${progress}%` }} />
          </div>

          <div className="ai-sr" aria-live="polite">
            {current.caption}
          </div>
        </div>

        {/* RIGHT VISUAL */}
        <div className="ai-right">
          <div className="coins">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={`coin coin-${i + 1}`} />
            ))}
          </div>

          <div className="badge-card">
            <div className="badge-small">재신청</div>
            <div className="badge-big">C</div>
            <div className="badge-progress">
              <div
                className="badge-progress-bar"
                style={{ width: `${((index + 1) / scenes.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="pulse" />
        </div>
      </div>

      <p className="ai-smallprint">
        본 화면은 안내 목적의 데모입니다. 실제 접수 및 문의는 고용노동부 공식 채널을 이용해 주세요.
      </p>
    </section>
  );
};

const EducationVideo = () => {
  return (
    <div className="page-wrapper">
      <div className="header-fixed">
        <Header />
      </div>

      {/* 본문 컨텐츠 */}
      <main className="content">
        <h1 className="community-title">AI 안내 영상 데모</h1>
        <MoELAiNotice />
      </main>

      <Footer />
    </div>
  );
};

export default EducationVideo;
