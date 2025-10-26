import { useEffect, useMemo, useRef, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Educationvideo.css"; // ✅ 커스텀 CSS 임포트

/**
 * EducationVideo.tsx — "AI 안내 영상" 인터랙티브 플레이어
 * - Web Speech API(TTS)로 장면별 나레이션
 * - 자막(카라오케) 하이라이트, 재생/일시정지/다시보기/음소거/배속
 * - 좌측 텍스트 + 우측 비주얼(SVG 아바타 + 코인/펄스 + 배지 카드)
 * - Tailwind + 커스텀 CSS(.ai-*) 병행
 */

type Scene = { title: string; big: string; caption: string };

type MoELAiNoticeProps = {
  ctaHref?: string;
  datesPhrase?: string;
  contact?: string;
  scenesOverride?: Scene[];
};

const defaultScenes = (datesPhrase: string, contact: string): Scene[] => [
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
];

const MoELAiNotice = ({
  ctaHref = "https://www.moel.go.kr",
  datesPhrase = "9.25(목)~9.28(일)",
  contact = "고객상담센터(국번없이 1350), 관할 지방관서",
  scenesOverride,
}: MoELAiNoticeProps) => {
  // 데이터
  const scenes = useMemo(
    () => scenesOverride ?? defaultScenes(datesPhrase, contact),
    [datesPhrase, contact, scenesOverride]
  );

  // 상태
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0); // 0~100
  const [rate, setRate] = useState(1.0);
  const [karaokeIdx, setKaraokeIdx] = useState<number | null>(null); // 자막 하이라이트 인덱스

  // Speech
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<number | null>(null);

  // 배경음 (선택)
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") synthRef.current = window.speechSynthesis;
    bgmRef.current = new Audio(); // 필요시 소스 할당
    bgmRef.current.loop = true;

    return () => {
      if (synthRef.current) synthRef.current.cancel();
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (bgmRef.current) bgmRef.current.pause();
    };
  }, []);

  const speak = (text: string) => {
    if (!synthRef.current) return;
    setKaraokeIdx(null);
    synthRef.current.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ko-KR";
    u.rate = rate;
    u.pitch = 1.0;
    u.volume = muted ? 0 : 1;

    // 일부 브라우저에서만 워드 경계 지원
    u.onboundary = (e: any) => {
      if (e.name === "word" || e.charIndex !== undefined) {
        setKaraokeIdx(e.charIndex);
      }
    };

    u.onend = () => {
      setKaraokeIdx(null);
    };

    utterRef.current = u;
    synthRef.current.speak(u);
  };

  // 장면 자동 전환(6초)
  useEffect(() => {
    if (!playing) return;

    const s = scenes[index];
    const narration = `${s.title}. ${s.big}. ${s.caption}`;
    speak(narration);

    const total = 6000; // ms
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
  }, [index, playing, rate, muted, scenes]);

  // 재생/일시정지 토글 시 음성/배경음 동기
  useEffect(() => {
    if (!bgmRef.current) return;
    if (playing && !muted) bgmRef.current.play().catch(() => {});
    else bgmRef.current.pause();
  }, [playing, muted]);

  const current = scenes[index];

  // 자막 카라오케 렌더링(문자 단위 하이라이트)
  const renderKaraoke = (text: string) => {
    if (karaokeIdx === null) return text;
    return (
      <span>
        <span>{text.slice(0, karaokeIdx)}</span>
        <span style={{ backgroundColor: "rgba(250, 204, 21, 0.7)", borderRadius: 4, padding: "0 2px" }}>
          {text.slice(karaokeIdx, karaokeIdx + 1)}
        </span>
        <span>{text.slice(karaokeIdx + 1)}</span>
      </span>
    );
  };

  const percentDone = Math.round(((index + 1) / scenes.length) * 100);

  return (
    <section className="ai-video">
      <div className="ai-stage">
        {/* LEFT: 텍스트/컨트롤 */}
        <div className="ai-left">
          <div className="fade-up">
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                border: "1px solid var(--line-2)",
                borderRadius: 999,
                background: "rgba(255,255,255,.7)",
                padding: "6px 10px",
                fontSize: 12,
                fontWeight: 700,
                color: "var(--text-700)",
                backdropFilter: "blur(6px)",
              }}
              aria-hidden
            >
              AI 안내 영상 데모
            </div>
          </div>

          <h2 className="ai-title fade-up-delay">{current.title}</h2>
          <h1 className="ai-big fade-up-delay-2">{current.big}</h1>
          <p className="ai-caption fade-up">{renderKaraoke(current.caption)}</p>

          {/* Controls */}
          <div className="ai-controls">
            <button
              className="btn-outline"
              onClick={() => {
                if (!playing) setPlaying(true);
                else {
                  setPlaying(false);
                  synthRef.current?.cancel();
                  if (timerRef.current) window.clearInterval(timerRef.current);
                }
              }}
            >
              {playing ? "일시정지" : "재생"}
            </button>

            <button className="btn-outline" onClick={() => setMuted((m) => !m)}>
              {muted ? "음소거 해제" : "음소거"}
            </button>

            <button
              className="btn-outline"
              onClick={() => {
                setIndex(0);
                setProgress(0);
                setPlaying(true);
                setKaraokeIdx(null);
              }}
            >
              다시 보기
            </button>

            <a className="btn-primary" href={ctaHref} target="_blank" rel="noreferrer">
              자세히 보기
            </a>

            {/* 배속 */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginLeft: 6 }}>
              <span style={{ fontSize: 12, color: "var(--text-600)" }}>배속</span>
              {[0.9, 1, 1.1, 1.25].map((r) => (
                <button
                  key={r}
                  className="btn-outline"
                  style={rate === r ? { background: "var(--text-900)", color: "#fff", borderColor: "var(--text-900)" } : {}}
                  onClick={() => setRate(r)}
                >
                  {r}x
                </button>
              ))}
            </div>
          </div>

          {/* Stepper */}
          <div className="ai-stepper">
            {scenes.map((_, i) => (
              <button
                key={i}
                className={`ai-step ${i <= index ? "is-active" : ""}`}
                onClick={() => setIndex(i)}
                aria-label={`장면 ${i + 1}`}
              />
            ))}
          </div>

          {/* Progress */}
          <div className="ai-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
            <div className="ai-progress-bar" style={{ width: `${progress}%` }} />
          </div>

          <p className="ai-sr">본 화면은 안내 목적의 데모입니다. 실제 접수 및 문의는 고용노동부 공식 채널을 이용해 주세요.</p>
        </div>

        {/* RIGHT: 비주얼(Stage) */}
        <div className="ai-right">
          {/* 코인 (CSS 애니메이션) */}
          <div className="coins" aria-hidden>
            <div className="coin coin-1" />
            <div className="coin coin-2" />
            <div className="coin coin-3" />
            <div className="coin coin-4" />
            <div className="coin coin-5" />
          </div>

          {/* 아바타 */}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Avatar talking={playing && !muted} />
          </div>

          {/* 배지 카드 */}
          <div className="badge-card" aria-hidden>
            <div className="badge-small">Scene</div>
            <div className="badge-big">
              {index + 1} / {scenes.length}
            </div>
            <div className="badge-progress">
              <div className="badge-progress-bar" style={{ width: `${percentDone}%` }} />
            </div>
          </div>

          {/* 하단 펄스 */}
          <div className="pulse" aria-hidden />
        </div>
      </div>
    </section>
  );
};

/* -------------------- 비주얼 컴포넌트들 -------------------- */
const Avatar = ({ talking }: { talking: boolean }) => {
  // 간단한 SVG 아바타(입 모양이 말할 때 살짝 변함)
  return (
    <svg width="240" height="240" viewBox="0 0 240 240" className="drop-shadow-sm">
      {/* face */}
      <circle cx="120" cy="120" r="92" fill="#F8FAFC" stroke="#111827" strokeWidth="3" />
      {/* eyes */}
      <circle cx="90" cy="110" r="6" fill="#111827" />
      <circle cx="150" cy="110" r="6" fill="#111827" />
      {/* mouth */}
      {talking ? (
        <path d="M90 150 Q120 165 150 150" fill="none" stroke="#111827" strokeWidth="6" strokeLinecap="round" />
      ) : (
        <path d="M95 148 Q120 158 145 148" fill="none" stroke="#111827" strokeWidth="4" strokeLinecap="round" />
      )}
      {/* badge */}
      <rect x="100" y="36" width="40" height="16" rx="8" fill="#111827" />
      <text x="120" y="48" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700">
        IRoun
      </text>
    </svg>
  );
};

/* --------------------------- 페이지 --------------------------- */

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
