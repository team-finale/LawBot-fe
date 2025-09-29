// src/pages/QuizPage.tsx
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

type QuizSummary = {
  id: number;
  title: string;
  category: string;
  level: "입문" | "기초" | "중급" | "고급";
  questions: number;
  estMin: number; // 예상 소요(분)
};

const mockQuizzes: QuizSummary[] = [
  { id: 1, title: "청소년-최저임금 기본 상식", category: "임금", level: "입문", questions: 8, estMin: 5 },
  { id: 2, title: "직장인-연차·휴가 핵심 쏙쏙", category: "휴가", level: "기초", questions: 10, estMin: 7 },
  { id: 3, title: "정규직 노동자-근로시간·야근수당", category: "근로시간", level: "중급", questions: 12, estMin: 9 },
  { id: 4, title: "플랫폼 노동자-부당해고 대응 체크", category: "고용안정", level: "중급", questions: 10, estMin: 8 },
];

const CATEGORIES = ["전체", "임금", "휴가", "근로시간", "고용안정"] as const;

type View = "landing" | "info";

export default function QuizPage() {
  const navigate = useNavigate();
  const [active, setActive] = useState<(typeof CATEGORIES)[number]>("전체");
  const [list, setList] = useState<QuizSummary[]>([]);
  const [view, setView] = useState<View>("landing");
  const [selected, setSelected] = useState<QuizSummary | null>(null);

  useEffect(() => {
    // TODO: 실제 API로 교체 (GET /api/quiz/list)
    setList(mockQuizzes);
  }, []);

  const filtered = active === "전체" ? list : list.filter(q => q.category === active);

  const openInfo = (q: QuizSummary) => {
    setSelected(q);
    setView("info");
  };

  const backToLanding = () => {
    setView("landing");
    setSelected(null);
  };

  return (
    <div className="page-wrapper">
      <style>{styles}</style>

      <div className="header-fixed">
        <Header />
      </div>

      <main className="page-content">
        {view === "landing" && (
          <>
            {/* Hero */}
            <section className="hero">
              <div className="hero-left">
                <h1 className="hero-title">
                  노동권, <span>퀴즈로</span> 쉽고 재밌게
                </h1>
                <p className="hero-sub">
                  퀴즈로 쉽게 배우는 노동법. 매일 10분, 현명한 선택의 시작!
                </p>
                <div className="hero-cta">
                  <button className="btn-primary" onClick={() => openInfo(list[0] || mockQuizzes[0])}>
                    지금 바로 시작하기
                  </button>
                  <a href="#catalog" className="btn-ghost">퀴즈 모아보기</a>
                </div>
                <div className="hero-stats">
                  <div><b>3,240</b><span>명이 학습 중 (희망사항)</span></div>
                  <div><b>127</b><span>개의 퀴즈</span></div>
                  <div><b>92%</b><span>만족도</span></div>
                </div>
              </div>
              <div className="hero-right">
                <div className="hero-card">
                  <div className="hero-card-badge">오늘의 퀴즈</div>
                  <div className="hero-card-title">5일 연속 출석하셨어요!</div>
                  <div className="hero-card-meta">입문 · 14문항 · 10분</div>
                  <button className="hero-card-cta" onClick={() => navigate("/quiz")}>시작하기</button>
                </div>
              </div>
            </section>

            {/* 카테고리 탭 + 카드 */}
            <section id="catalog" className="catalog">
              <div className="catalog-head">
                <h2>시나리오 기반 퀴즈</h2>
                <div className="tabs">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      className={`tab ${active === cat ? "is-active" : ""}`}
                      onClick={() => setActive(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid">
                {filtered.map(q => (
                  <article key={q.id} className="card">
                    <div className="card-badge">{q.category}</div>
                    <h3 className="card-title">{q.title}</h3>
                    <div className="card-meta">
                      <span>{q.level}</span>
                      <span>· {q.questions}문항</span>
                      <span>· {q.estMin}분</span>
                    </div>
                    <div className="card-actions">
                      <button className="btn-primary" onClick={() => navigate("/quiz")}>바로 풀기</button>
                      <button className="btn-soft" onClick={() => openInfo(q)}>자세히</button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* 하단 배너 */}
            <section className="cta-banner">
              <div className="cta-content">
                <h3>로운이와 매일 10분</h3>
                <p>매일 출석해 학습하면 특별 배지를 드려요!</p>
              </div>
              <button className="btn-white" onClick={() => navigate("/quiz")}>오늘 학습 시작</button>
            </section>
          </>
        )}

        {view === "info" && selected && (
          <section className="container">
            <button className="back-btn" onClick={backToLanding}>← 목록으로</button>
            <h1 className="page-title">{selected.title}</h1>
            <p className="page-desc">
              카테고리: <b>{selected.category}</b> · 난이도: <b>{selected.level}</b> · 문항: <b>{selected.questions}</b> · 예상 {selected.estMin}분
            </p>

            <div className="info-card">
              <h3>이 퀴즈로 배우는 것</h3>
              <ul>
                <li>핵심 개념을 예시와 함께 빠르게 이해</li>
                <li>오답 노트로 약점 자동 복습</li>
                <li>스트릭/배지로 동기부여</li>
              </ul>
              <div className="info-actions">
                {/* ✅ navigate 사용 */}
                <button className="btn-primary" onClick={() => navigate("/quiz")}>
                  퀴즈 시작
                </button>
                <button className="btn-ghost" onClick={backToLanding}>다른 퀴즈 보기</button>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

/* ---- 내부 스타일 (한 파일 안에서 사용) ---- */
const styles = `
.page-wrapper { min-height: 100dvh; display: flex; flex-direction: column; }

/* 헤더 */
.header-fixed {
  position: sticky;
  top: 0;
  z-index: 50;
  background: #fff;
  border-bottom: 1px solid #eee;
}

/* 헤더 높이만큼 패딩 */
.page-content { 
  flex: 1; 
  padding: 24px 16px; 
  padding-top: 72px; 
}

.container { max-width: 1080px; margin: 0 auto; }
#catalog { scroll-margin-top: 72px; }

/* Hero */
.hero { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 32px; align-items: center; max-width: 1080px; margin: 24px auto 40px; }
.hero-title { font-size: 40px; line-height: 1.2; margin: 0 0 12px; font-weight: 800; letter-spacing: -0.4px; }
.hero-title span { background: linear-gradient(90deg, #5c4435, #6B7280); -webkit-background-clip: text; color: transparent; }
.hero-sub { color: #4B5563; margin: 0 0 16px; }
.hero-cta { display: flex; gap: 12px; margin-top: 8px; }

/* 버튼 */
.btn-primary, .btn-ghost, .btn-secondary, .btn-soft, .btn-white {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 10px 14px; border-radius: 10px; border: 1px solid transparent; font-weight: 600; text-decoration: none; cursor: pointer;
}
.btn-primary { background: #5c4435; color: #fff; }   /* ✅ 변경 */
.btn-ghost { background: #fff; border-color: #e5e7eb; color: #111827; }
.btn-secondary { background: #374151; color: #fff; }
.btn-soft { background: #f3f4f6; color: #111827; }
.btn-white { background: #fff; color: #111827; border: 1px solid #e5e7eb; }

.hero-stats { display: flex; gap: 20px; margin-top: 18px; color: #6B7280; }
.hero-stats b { display: block; font-size: 20px; color: #111827; }

/* 추천 카드 */
.hero-right { display: flex; justify-content: center; }
.hero-card { position: relative; width: 100%; max-width: 360px; border: 1px solid #eee; border-radius: 16px; padding: 18px; background: #fff; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
.hero-card-badge { position: absolute; top: -10px; left: 16px; background: #111827; color: #fff; padding: 6px 10px; border-radius: 10px; font-size: 12px; }
.hero-card-title { font-weight: 700; font-size: 18px; margin: 8px 0 6px; }
.hero-card-meta { color: #6B7280; font-size: 14px; margin-bottom: 12px; }
.hero-card-cta { display: inline-flex; align-items: center; justify-content: center; background: #5c4435; color: #fff; padding: 8px 12px; border-radius: 10px; text-decoration: none; } /* ✅ 변경 */

/* 카탈로그 */
.catalog { max-width: 1080px; margin: 0 auto 48px; }
.catalog-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.tabs { display: flex; gap: 8px; flex-wrap: wrap; }
.tab { padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 999px; background: #fff; color: #374151; cursor: pointer; }
.tab.is-active { background: #5c4435; color: #fff; border-color: #5c4435; } /* ✅ 탭도 색상 맞춤 */

/* 카드 */
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
.card {
  display: flex; flex-direction: column;
  border: 1px solid #eee; border-radius: 16px; padding: 16px; background: #fff;
  min-height: 180px;
}
.card-badge { background: #f3f4f6; color: #374151; font-size: 12px; padding: 4px 8px; border-radius: 8px; align-self: flex-start; }
.card-title { font-size: 16px; font-weight: 700; margin: 10px 0 6px; }
.card-meta { color: #6B7280; font-size: 14px; margin-bottom: 12px; }
.card-actions { margin-top: auto; display: flex; gap: 8px; }

/* CTA 배너 */
.cta-banner { max-width: 1080px; margin: 0 auto 40px; display: flex; align-items: center; justify-content: space-between;
  background: #111827; color: #fff; border-radius: 16px; padding: 18px 20px; }
.cta-content h3 { margin: 0 0 4px; font-size: 18px; }
.cta-content p { margin: 0; color: #E5E7EB; }

/* Info */
.page-title { font-size: 28px; font-weight: 800; margin: 8px 0; }
.page-desc { color: #4B5563; margin-bottom: 16px; }
.info-card { border: 1px solid #eee; border-radius: 16px; padding: 16px; background: #fff; max-width: 720px; }
.info-card h3 { margin: 0 0 10px; font-size: 18px; }
.info-card ul { margin: 0 0 12px 18px; color: #374151; }
.info-actions { display: flex; gap: 8px; }
.back-btn { margin-bottom: 8px; background: transparent; border: none; color: #374151; cursor: pointer; font-weight: 600; }

@media (max-width: 900px) { .hero { grid-template-columns: 1fr; } }
`;
