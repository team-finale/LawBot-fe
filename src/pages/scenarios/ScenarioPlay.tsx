// src/pages/scenarios/ScenarioPlay.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import useRequireAuth from "../../hooks/useRequireAuth";
import {
  getScenario,
  submitScenarioAnswers,
  ScenarioDetail,
  ScenarioAnswerReq,
} from "../../api/scenario";
import "./scenario.css";

export default function ScenarioPlay() {
  useRequireAuth();
  const { scenarioId } = useParams();
  const nav = useNavigate();

  const [detail, setDetail] = useState<ScenarioDetail | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [unlocked, setUnlocked] = useState<number[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  const [submitting, setSubmitting] = useState(false);
  const [stepResult, setStepResult] = useState<any>(null); // 직전 문항 채점 결과 (오답 해설용)
  const [finalResult, setFinalResult] = useState<any>(null); // 마지막 총점 결과
  const [error, setError] = useState<string | null>(null);

  // 1) 상세 조회
  useEffect(() => {
    (async () => {
      try {
        setError(null);
        const data = await getScenario(scenarioId!);
        setDetail(data);
        if (Array.isArray(data.steps) && data.steps.length > 0) {
          setUnlocked([data.steps[0].id]); // 첫 문항만 오픈
        }
      } catch (e: any) {
        setError(e?.response?.data?.detail ?? "시나리오를 불러오지 못했습니다.");
      }
    })();
  }, [scenarioId]);

  const steps = detail?.steps ?? [];
  const isReady = steps.length > 0;
  const current = useMemo(() => (isReady ? steps[currentIdx] : null), [isReady, steps, currentIdx]);
  const isLast = isReady && currentIdx === steps.length - 1;
  const isUnlocked = !!current && unlocked.includes(current.id);

  if (!detail) {
    return (
      <div className="page-wrapper">
        <div className="header-fixed"><Header /></div>
        <main className="page-content" style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ textAlign: "center", marginTop: 80 }}>로딩 중…</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="page-wrapper">
        <div className="header-fixed"><Header /></div>
        <main className="page-content" style={{ maxWidth: 720, margin: "0 auto" }}>
          <h1 className="text-xl font-bold mb-2">{detail.name}</h1>
          <p className="text-gray-600">아직 이 시나리오의 문항이 준비되지 않았어요.</p>
        </main>
        <Footer />
      </div>
    );
  }

  // 2) 한 문제씩 채점 (해금용)
  const submitOneAndUnlock = async () => {
    if (!current) return;
    const picked = answers[current.id];
    if (!picked) return;

    setSubmitting(true);
    setError(null);
    try {
      const payload: ScenarioAnswerReq = {
        answers: [{ step_id: current.id, answer: picked }],
      };
      const res = await submitScenarioAnswers(scenarioId!, payload);
      setStepResult(res);

      // 해금 목록이 있으면 다음 문제로 이동
      const newly = Array.isArray(res?.unlocked_step_ids) ? res.unlocked_step_ids : [];
      if (newly.length > 0) {
        setUnlocked((prev) => Array.from(new Set([...prev, ...newly])));
        // 다음 문제로 이동
        if (!isLast) {
          setCurrentIdx((v) => v + 1);
          setStepResult(null); // 다음 문제로 넘어가면 직전 해설 숨김
        } else {
          // 마지막 문항이었으면 최종 제출로 이어짐
          await submitAllAtOnce();
        }
      }
      // 해금이 없으면(=오답) 해설만 표시하고 현재 문제에 머문다.
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? "채점 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  // 3) 마지막에 전체 제출 (총점/카테고리 카운트/해설)
  const submitAllAtOnce = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const payload: ScenarioAnswerReq = {
        answers: steps.map((s) => ({
          step_id: s.id,
          answer: answers[s.id],
        })),
      };
      const res = await submitScenarioAnswers(scenarioId!, payload);
      setFinalResult(res);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? "최종 결과 제출 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const progress = `${currentIdx + 1} / ${steps.length}`;

  return (
    <div className="page-wrapper">
      <div className="header-fixed"><Header /></div>

      <main className="page-content" style={{ maxWidth: 720, margin: "0 auto" }}>
        <h1 className="text-xl font-bold mb-1">{detail.name}</h1>
        <p className="text-gray-600 mb-4">{detail.description}</p>

        {/* 진행률 */}
        <div className="scenario-progress" aria-label="진행률">
          {progress}
        </div>

        {error && <div className="error-box" role="alert">{error}</div>}

        {/* 최종 결과가 나오면 결과 블록 */}
        {finalResult ? (
          <div className="result-box">
            <h3 className="font-semibold mb-2">🎉 최종 결과</h3>
            <p className="mb-2">
              총 정답 수: {finalResult.total_correct} / {steps.length}
            </p>

            {/* 카테고리별 카운트 */}
            {finalResult.category_correct_count && (
              <ul className="mb-3">
                {Object.entries(finalResult.category_correct_count).map(([cat, cnt]: any) => (
                  <li key={cat}>
                    {cat}: {cnt}
                  </li>
                ))}
              </ul>
            )}

            {/* 오답 해설 (응답에 explanations가 오면 표시) */}
            {finalResult.explanations && (
              <details className="mb-3">
                <summary className="cursor-pointer">오답 해설 보기</summary>
                <ul style={{ marginTop: 8 }}>
                  {steps.map((s) => {
                    const k = String(s.id);
                    const exp = finalResult.explanations?.[k];
                    if (!exp) return null;
                    return (
                      <li key={s.id} style={{ marginBottom: 6 }}>
                        <b>Q{ s.step_order ?? s.id }.</b> {s.question}
                        <div className="explanation">해설: {exp}</div>
                      </li>
                    );
                  })}
                </ul>
              </details>
            )}

            <div className="flex gap-2">
              <button className="complete-btn" onClick={() => nav("/scenarios")}>
                목록으로
              </button>
              <button className="next-btn" onClick={() => nav("/")}>
                홈으로
              </button>
            </div>
          </div>
        ) : (
          // 최종 결과 전: 현재 문항 카드
          current && (
            <section className="scenario-card mb-4" role="group" aria-label={`문항 ${currentIdx + 1}`}>
              <div className="scenario-step-head">
                <span className="scenario-step-badge">STEP {currentIdx + 1}</span>
                {!isUnlocked && <span className="lock-chip">🔒 잠금</span>}
              </div>

              <h3 className="font-semibold mb-2">{current.question}</h3>

              {Object.entries(current.choices).map(([key, label]) => (
                <label key={key} className={`choice ${answers[current.id] === key ? "is-selected" : ""}`}>
                  <input
                    type="radio"
                    name={`step-${current.id}`}
                    disabled={!isUnlocked || submitting}
                    checked={answers[current.id] === key}
                    onChange={() => {
                      setStepResult(null); // 새 선택 시 이전 해설 숨기기
                      setAnswers((prev) => ({ ...prev, [current.id]: key }));
                    }}
                  />
                  <span className="choice-key">{key}.</span>
                  <span>{label}</span>
                </label>
              ))}

              {/* 오답 시 해설 노출 */}
              {stepResult?.explanations?.[String(current.id)] && (
                <div className="explanation mt-2">
                  ❗ 해설: {stepResult.explanations[String(current.id)]}
                </div>
              )}

              <div className="scenario-actions">
                {!isLast ? (
                  <button
                    className="next-btn"
                    disabled={!answers[current.id] || submitting}
                    onClick={submitOneAndUnlock}
                  >
                    다음 문제 →
                  </button>
                ) : (
                  <button
                    className="next-btn"
                    disabled={!answers[current.id] || submitting}
                    onClick={submitAllAtOnce}
                  >
                    최종 결과 보기 →
                  </button>
                )}
              </div>

              {/* 모바일용 힌트 */}
              {!isUnlocked && (
                <p className="text-sm text-gray-500 mt-2">
                  이전 문제를 맞혀야 이 단계가 열립니다.
                </p>
              )}
            </section>
          )
        )}
      </main>

      <Footer />
    </div>
  );
}
