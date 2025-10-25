import { useEffect, useMemo, useRef, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

/**
 * EducationVideo.tsx — "AI 안내 영상" 느낌의 인터랙티브 플레이어
 * - Web Speech API(TTS)로 장면별 나레이션
 * - 자막(카라오케) 하이라이트, 재생/일시정지/다시보기/음소거/배속
 * - 좌측 텍스트 + 우측 비주얼(SVG 아바타 + 코인/펄스 + 배경 그라디언트 애니메이션)
 * - Tailwind 기반 단일 파일 스타일 (외부 CSS 불필요)
 *
 * 주의: SpeechSynthesis는 브라우저/OS TTS 엔진을 사용합니다.
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
    // BGM 미세한 루프(저작권 이슈 없는 간단 톤) — 필요시 파일로 교체 가능
    bgmRef.current = new Audio();
    // 무음 기본 (원하면 BGM 파일 경로 세팅)
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

    // 카라오케(워드 바운더리) — 일부 브라우저에서만 지원
    u.onboundary = (e: any) => {
      if (e.name === "word" || e.charIndex !== undefined) {
        setKaraokeIdx(e.charIndex);
      }
    };

    // 다음 장면으로
    u.onend = () => {
      setKaraokeIdx(null);
      // 음성 종료 시 남은 진행바 애니메이션이 있다면 무시
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
        <span className="bg-yellow-200/70 rounded px-0.5">{text.slice(karaokeIdx, karaokeIdx + 1)}</span>
        <span>{text.slice(karaokeIdx + 1)}</span>
      </span>
    );
  };

  return (
    <section className="relative overflow-hidden">
      {/* 배경 그라디언트 + 노이즈 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 animate-[gradient_12s_ease_infinite] bg-[radial-gradient(circle_at_20%_20%,#fde68a,transparent_35%),radial-gradient(circle_at_80%_30%,#c7d2fe,transparent_35%),radial-gradient(circle_at_40%_80%,#bbf7d0,transparent_35%)]" />
        <div className="absolute inset-0 opacity-[0.08] mix-blend-soft-light" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'160\\' height=\\'160\\'><filter id=\\'n\\'><feTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.65\\' numOctaves=\\'2\\'/></filter><rect width=\\'100%\\' height=\\'100%\\' filter=\\'url(%23n)\\' opacity=\\'0.2\\'/></svg>')" }} />
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* LEFT: 텍스트/컨트롤 */}
          <div className="flex flex-col">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/70 px-3 py-1 text-xs font-medium text-neutral-700 backdrop-blur">
                <span className="i-lucide-bot text-[14px]" />
                AI 안내 영상 데모
              </div>
            </div>

            <h2 className="text-sm md:text-base font-semibold text-neutral-600 mb-2 animate-[fadeUp_600ms_ease]">{current.title}</h2>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-neutral-900 mb-3 animate-[fadeUp_700ms_ease]">
              {current.big}
            </h1>
            <p className="text-neutral-700 text-base md:text-lg leading-relaxed animate-[fadeUp_800ms_ease]">
              {renderKaraoke(current.caption)}
            </p>

            {/* Controls */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <button
                className="px-3.5 py-2 text-sm font-semibold rounded-xl border border-neutral-300 bg-white/80 hover:bg-white shadow-sm backdrop-blur"
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

              <button
                className="px-3.5 py-2 text-sm font-semibold rounded-xl border border-neutral-300 bg-white/80 hover:bg-white shadow-sm backdrop-blur"
                onClick={() => setMuted((m) => !m)}
              >
                {muted ? "음소거 해제" : "음소거"}
              </button>

              <button
                className="px-3.5 py-2 text-sm font-semibold rounded-xl border border-neutral-300 bg-white/80 hover:bg-white shadow-sm backdrop-blur"
                onClick={() => {
                  setIndex(0);
                  setProgress(0);
                  setPlaying(true);
                  setKaraokeIdx(null);
                }}
              >
                다시 보기
              </button>

              <a
                className="px-3.5 py-2 text-sm font-semibold rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 shadow-sm"
                href={ctaHref}
                target="_blank"
                rel="noreferrer"
              >
                자세히 보기
              </a>

              {/* 배속 */}
              <div className="ml-2 inline-flex items-center gap-2 px-2 py-1 rounded-lg border border-neutral-300 bg-white/70">
                <span className="text-xs text-neutral-600">배속</span>
                {[0.9, 1, 1.1, 1.25].map((r) => (
                  <button
                    key={r}
                    className={`px-2 py-1 text-xs rounded-md ${rate === r ? "bg-neutral-900 text-white" : "hover:bg-neutral-100"}`}
                    onClick={() => setRate(r)}
                  >
                    {r}x
                  </button>
                ))}
              </div>
            </div>

            {/* Stepper */}
            <div className="mt-5 flex items-center gap-2">
              {scenes.map((_, i) => (
                <button
                  key={i}
                  className={`h-2 w-8 rounded-full transition-colors ${i <= index ? "bg-neutral-900" : "bg-neutral-300"}`}
                  onClick={() => setIndex(i)}
                  aria-label={`장면 ${i + 1}`}
                />)
              )}
            </div>

            {/* Progress */}
            <div className="mt-3 h-2 w-full rounded-full bg-neutral-200 overflow-hidden">
              <div className="h-full bg-neutral-900 transition-[width]" style={{ width: `${progress}%` }} />
            </div>

            <p className="mt-3 text-xs text-neutral-500">
              본 화면은 안내 목적의 데모입니다. 실제 접수 및 문의는 고용노동부 공식 채널을 이용해 주세요.
            </p>
          </div>

          {/* RIGHT: 비주얼(Stage) */}
          <div className="relative min-h-[340px] md:min-h-auto rounded-3xl border border-neutral-200 bg-white/70 backdrop-blur overflow-hidden shadow-sm">
            {/* 파티클/코인 */}
            <Coins index={index} total={scenes.length} />

            {/* 아바타 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Avatar talking={playing && !muted} />
            </div>

            {/* 모서리 배지 */}
            <div className="absolute top-4 right-4">
              <div className="rounded-2xl bg-neutral-900 text-white px-3 py-2 shadow-md">
                <div className="text-[10px] uppercase tracking-widest opacity-70">Scene</div>
                <div className="text-lg font-extrabold leading-none">{index + 1} / {scenes.length}</div>
              </div>
            </div>

            {/* 하단 펄스 */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-6 w-[160px] h-[160px] rounded-full bg-neutral-900/5 animate-[pulseSoft_2.5s_ease_infinite]" />
          </div>
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes gradient { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3%)} }
        @keyframes floaty { 0%{ transform: translateY(0) } 50%{ transform: translateY(-8px) } 100%{ transform: translateY(0) } }
        @keyframes pulseSoft { 0%{ transform: translateX(-50%) scale(0.95); opacity:.45 } 50%{ transform: translateX(-50%) scale(1); opacity:.25 } 100%{ transform: translateX(-50%) scale(0.95); opacity:.45 } }
        @keyframes fadeUp { from { opacity:0; transform: translateY(6px);} to { opacity:1; transform: translateY(0);} }
      `}</style>
    </section>
  );
};

/* -------------------- 비주얼 컴포넌트들 -------------------- */

const Coins = ({ index, total }: { index: number; total: number }) => {
  const arr = Array.from({ length: 6 });
  return (
    <div className="absolute inset-0 pointer-events-none">
      {arr.map((_, i) => (
        <div
          key={i}
          className="absolute w-7 h-7 rounded-full border border-amber-300/70 bg-amber-100/60 shadow"
          style={{
            left: `${10 + i * 14}%`,
            top: `${20 + ((i * 13) % 40)}%`,
            animation: `floaty ${2.2 + (i % 3) * 0.4}s ease-in-out ${i * 0.1}s infinite`,
            filter: index >= Math.floor(((i + 1) / arr.length) * total) ? "saturate(1.1)" : "saturate(0.7)",
          }}
        />
      ))}
    </div>
  );
};

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
      <text x="120" y="48" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700">IRoun</text>
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

      <main className="max-w-[1200px] mx-auto px-4 py-10">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-900">이로운과 함께하는 노동법 교육</h1>
        <p className="mt-2 text-neutral-600">교육 영상을 통해 실생활 속 노동법을 이해하고 익혀보세요.</p>

        <div className="mt-8">
          <MoELAiNotice />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EducationVideo;
