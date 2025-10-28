import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import useRequireAuth from "../../hooks/useRequireAuth";
import {
  getScenario,
  submitScenarioAnswers,
  type ScenarioDetail,
  type ScenarioAnswerReq,
} from "../../api/scenario";
import "./scenario.css";

export default function ScenarioPlay() {
  useRequireAuth();
  const { scenarioId } = useParams();
  const nav = useNavigate();

  const [detail, setDetail] = useState<ScenarioDetail | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [stepResult, setStepResult] = useState<any>(null);
  const [finalResult, setFinalResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // ✅ 시나리오 불러오기
  useEffect(() => {
    (async () => {
      try {
        setError(null);
        const data = await getScenario(scenarioId!);
        console.log("✅ getScenario:", { url: `/quiz/scenarios/${scenarioId}`, data });
        if (!data || !Array.isArray(data.steps)) throw new Error("시나리오 steps가 없습니다.");
        setDetail(data);
      } catch (e: any) {
        console.error("❌ getScenario error:", e?.response ?? e);
        setError(e?.response?.data?.detail ?? e?.message ?? "시나리오 로드 실패");
      }
    })();
  }, [scenarioId]);

  if (error) {
    return (
      <div className="page-wrapper">
        <div className="header-fixed"><Header /></div>
        <main className="page-content" style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2 className="text-xl font-bold mb-2">시나리오 불러오기 실패</h2>
          <div className="error-box">{error}</div>
          <button type="button" className="next-btn" onClick={() => nav("/scenarios")}>
            목록으로
          </button>
        </main>
        <Footer />
      </div>
    );
  }

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

  const steps = detail.steps;
  const current = steps[currentIdx];
  const isLast = currentIdx === steps.length - 1;

  // ✅ 한 문제씩 제출
  const submitOneAndUnlock = async () => {
    if (!answers[current.id]) return;
    setSubmitting(true);
    setError(null);
    try {
      const payload: ScenarioAnswerReq = {
        answers: [{ step_id: current.id, answer: answers[current.id] }],
      };
      console.log("➡️ POST", `/quiz/scenarios/answers`, payload);
      const res = await submitScenarioAnswers(payload);
      console.log("⬅️ RES", res);
      setStepResult(res);

      // ✅ 다음 문제로 이동
      if (!isLast) {
        setCurrentIdx(i => i + 1);
      }
    } catch (e: any) {
      console.error("❌ submitScenarioAnswers error:", e?.response ?? e);
      setError(e?.response?.data?.detail ?? e?.message ?? "정답 제출 실패");
    } finally {
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // ✅ 마지막 문제 제출
  const submitAllAtEnd = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const payload: ScenarioAnswerReq = {
        answers: steps.map(s => ({ step_id: s.id, answer: answers[s.id] })),
      };
      console.log("➡️ POST (final)", `/quiz/scenarios/answers`, payload);
      const res = await submitScenarioAnswers(payload);
      console.log("⬅️ RES (final)", res);
      setFinalResult(res);
    } catch (e: any) {
      console.error("❌ submit final error:", e?.response ?? e);
      setError(e?.response?.data?.detail ?? e?.message ?? "최종 제출 실패");
    } finally {
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="page-wrapper">
      <div className="header-fixed"><Header /></div>
      <main className="page-content" style={{ maxWidth: 720, margin: "0 auto" }}>
        <h1 className="text-xl font-bold mb-2">{detail.name}</h1>
        <p className="text-gray-600 mb-4">{detail.description}</p>

        <div className="scenario-progress">
          {currentIdx + 1} / {steps.length}
        </div>

        {error && <div className="error-box">{error}</div>}

        <section className="scenario-card mb-4">
          <h3 className="font-semibold">{current.question}</h3>

          {/* ✅ 보기 선택 항상 가능하게 (잠금 조건 제거) */}
          {Object.entries(current.choices).map(([key, label]) => (
            <label key={key} className="choice">
              <input
                type="radio"
                name={`step-${current.id}`}
                disabled={submitting} // ✅ 수정: 항상 활성화
                checked={answers[current.id] === key}
                onChange={() => setAnswers(prev => ({ ...prev, [current.id]: key }))}
              />
              <span className="choice-key">{key}.</span>
              <span>{label}</span>
            </label>
          ))}

          {/* 오답 시 해설 */}
          {stepResult?.explanations?.[current.id] && (
            <div className="explanation">❗ 해설: {stepResult.explanations[current.id]}</div>
          )}
        </section>

        {!isLast ? (
          <button
            type="button"
            className="next-btn"
            disabled={!answers[current.id] || submitting}
            onClick={submitOneAndUnlock}
          >
            {submitting ? "채점 중…" : "다음 문제 →"}
          </button>
        ) : (
          <>
            {!finalResult ? (
              <button
                type="button"
                className="next-btn"
                disabled={submitting || steps.some(s => !answers[s.id])}
                onClick={submitAllAtEnd}
              >
                {submitting ? "채점 중…" : "최종 결과 보기 →"}
              </button>
            ) : (
              <div className="result-box">
                <h3>🎉 최종 결과</h3>
                <p>총 정답 수: {finalResult.total_correct} / {steps.length}</p>
                <button type="button" className="complete-btn" onClick={() => nav("/scenarios")}>
                  목록으로
                </button>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
