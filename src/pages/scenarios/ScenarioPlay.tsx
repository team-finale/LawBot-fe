// src/pages/scenarios/ScenarioPlay.tsx
import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import useRequireAuth from "../../hooks/useRequireAuth";
import {
  getScenario,
  submitScenarioAnswers,
  ScenarioDetail,
  ScenarioAnswerReq,
  ScenarioAnswerRes
} from "../../api/scenario";
import "./scenario.css";

export default function ScenarioPlay() {
  const { scenarioId } = useParams();
  const nav = useNavigate();
  const authed = useRequireAuth();

  const [detail, setDetail] = useState<ScenarioDetail | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [unlocked, setUnlocked] = useState<number[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  const [submittedOnce, setSubmittedOnce] = useState(false);
  const [stepResult, setStepResult] = useState<ScenarioAnswerRes | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const LS_KEY = useMemo(() => `scenario_${scenarioId}_draft`, [scenarioId]);

  // 진행률 %
  const progressPct = useMemo(() => {
    if (!detail) return 0;
    return Math.round(((currentIdx + 1) / detail.steps.length) * 100);
  }, [detail, currentIdx]);

  // ✅ 시나리오 로딩
  useEffect(() => {
    if (!authed) return;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const data = await getScenario(scenarioId!);
        setDetail(data);
        const firstId = data.steps[0].id;
        setUnlocked([firstId]);

        // 로컬 저장 복구
        const saved = localStorage.getItem(LS_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setAnswers(parsed.answers ?? {});
          setUnlocked(parsed.unlocked ?? [firstId]);
          setCurrentIdx(parsed.currentIdx ?? 0);
        }
      } catch (e: any) {
        setErr(e?.response?.data?.detail ?? "시나리오를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, [authed, scenarioId, LS_KEY]);

  // ✅ 실시간 상태 저장
  useEffect(() => {
    if (!detail) return;
    localStorage.setItem(
      LS_KEY,
      JSON.stringify({ answers, unlocked, currentIdx })
    );
  }, [answers, unlocked, currentIdx, detail, LS_KEY]);

  if (!authed) return null;
  if (loading) return loadingUI();
  if (err) return errorUI(err);
  if (!detail) return null;

  const step = detail.steps[currentIdx];
  const isUnlocked = unlocked.includes(step.id);
  const isLast = currentIdx === detail.steps.length - 1;

  const submitStep = async () => {
    setLoading(true);
    setErr(null);

    try {
      const payload: ScenarioAnswerReq = {
        answers: [{ step_id: step.id, answer: answers[step.id] }],
      };
      const res = await submitScenarioAnswers(scenarioId!, payload);
      setStepResult(res);
      setSubmittedOnce(true);

      // ✅ 다음 스텝 해금
      if (res.unlocked_step_ids?.length) {
        setUnlocked(prev => Array.from(new Set([...prev, ...res.unlocked_step_ids])));
        if (!isLast) {
          setCurrentIdx(v => v + 1);
          setStepResult(null);
        }
      }
    } catch (e: any) {
      setErr(e?.response?.data?.detail ?? "제출 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="header-fixed"><Header /></div>

      <main className="page-content" style={{ maxWidth: 720, margin: "0 auto" }}>
        <h1 className="scenario-title">{detail.name}</h1>
        <p className="scenario-desc mb-4">{detail.description}</p>

        {/* ✅ 진행바 */}
        <div className="progress-wrap">
          <div className="progress-label">
            {currentIdx + 1} / {detail.steps.length} ({progressPct}%)
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        {/* ✅ 문제 */}
        <section className="scenario-card mb-5">
          <div className="scenario-q">{step.question}</div>

          <div className="scenario-choices">
            {Object.entries(step.choices).map(([key, label]) => (
              <label key={key} className={`scenario-choice ${answers[step.id] === key ? "is-selected" : ""}`}>
                <input
                  type="radio"
                  name={`step-${step.id}`}
                  disabled={!isUnlocked || loading}
                  checked={answers[step.id] === key}
                  onChange={() => {
                    setAnswers(prev => ({ ...prev, [step.id]: key }));
                    setStepResult(null);
                  }}
                />
                <span className="scenario-choice-label"><b>{key}.</b> {label}</span>
              </label>
            ))}
          </div>

          {/* 오답 해설 */}
          {stepResult?.explanations?.[step.id] && (
            <div className="explanation">💡 해설: {stepResult.explanations[step.id]}</div>
          )}
        </section>

        {/* ✅ 네비 */}
        <div className="scenario-nav">
          {!isLast ? (
            <button
              className="next-btn"
              disabled={!answers[step.id] || loading}
              onClick={submitStep}
            >
              다음 문제 →
            </button>
          ) : (
            <>
              {!submittedOnce ? (
                <button
                  className="next-btn"
                  disabled={!answers[step.id] || loading}
                  onClick={submitStep}
                >
                  최종 결과 보기 →
                </button>
              ) : (
                <div className="result-box">
                  <h3>🎉 최종 결과</h3>
                  <p>총 정답 수: {stepResult?.total_correct ?? 0} / {detail.steps.length}</p>
                  <button className="complete-btn" onClick={() => nav("/scenarios")}>
                    목록으로
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

/* 🔽 별도 렌더 함수 */
const loadingUI = () => (
  <div className="page-wrapper">
    <div className="header-fixed"><Header /></div>
    <main className="page-content"><p>로딩 중…</p></main>
    <Footer />
  </div>
);

const errorUI = (err: string) => (
  <div className="page-wrapper">
    <div className="header-fixed"><Header /></div>
    <main className="page-content">
      <div className="error-box">{err}</div>
    </main>
    <Footer />
  </div>
);
