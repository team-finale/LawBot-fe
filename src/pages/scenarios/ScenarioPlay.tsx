import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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

  useEffect(() => {
    (async () => {
      try {
        setError(null);
        const data = await getScenario(scenarioId!);
        setDetail(data);
      } catch (e: any) {
        setError(e?.response?.data?.detail ?? e?.message ?? "시나리오 로드 실패");
      }
    })();
  }, [scenarioId]);

  if (error) {
    return (
      <div className="page-wrapper">
        <div className="header-fixed"><Header /></div>
        <main className="page-content text-center py-20">
          <h2 className="text-2xl font-bold mb-2">시나리오 불러오기 실패</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button className="next-btn" onClick={() => nav("/scenarios")}>목록으로</button>
        </main>
        <Footer />
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="page-wrapper">
        <div className="header-fixed"><Header /></div>
        <main className="page-content flex justify-center items-center h-[60vh] text-gray-600">
          로딩 중...
        </main>
        <Footer />
      </div>
    );
  }

  const steps = detail.steps;
  const current = steps[currentIdx];
  const isLast = currentIdx === steps.length - 1;

  const submitOneAndUnlock = async () => {
    if (!answers[current.id]) return;
    setSubmitting(true);
    setError(null);
    try {
      const payload: ScenarioAnswerReq = {
        answers: [{ step_id: current.id, answer: answers[current.id] }],
      };
      const res = await submitScenarioAnswers(payload);
      setStepResult(res);
      if (!isLast) setCurrentIdx(i => i + 1);
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? e?.message ?? "정답 제출 실패");
    } finally {
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const submitAllAtEnd = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const payload: ScenarioAnswerReq = {
        answers: steps.map(s => ({ step_id: s.id, answer: answers[s.id] })),
      };
      const res = await submitScenarioAnswers(payload);
      setFinalResult(res);
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? e?.message ?? "최종 제출 실패");
    } finally {
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="page-wrapper">
      <div className="header-fixed"><Header /></div>
      <main className="page-content max-w-xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-[#624e3e] mb-2">{detail.name}</h1>
        <p className="text-gray-600 mb-4">{detail.description}</p>

        <div className="scenario-progress mb-6 font-medium text-[#624e3e] bg-[#f5ede7] rounded-full inline-block px-4 py-1">
          {currentIdx + 1} / {steps.length}
        </div>

        <AnimatePresence mode="wait">
          <motion.section
            key={current.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="scenario-card bg-[#fffaf6] border-2 border-[#e5d6c3] rounded-2xl shadow-md p-5 mb-6"
          >
            <h3 className="font-semibold text-lg mb-4 text-[#3e2e25]">{current.question}</h3>

            {Object.entries(current.choices).map(([key, label]) => (
              <label key={key} className={`choice block px-4 py-2 rounded-lg mb-2 cursor-pointer transition
                ${answers[current.id] === key
                  ? "bg-[#624e3e] text-white font-semibold"
                  : "bg-[#f9f5f1] hover:bg-[#f0e8e0]"}`}>
                <input
                  type="radio"
                  name={`step-${current.id}`}
                  disabled={submitting}
                  checked={answers[current.id] === key}
                  onChange={() => setAnswers(prev => ({ ...prev, [current.id]: key }))}
                  className="hidden"
                />
                <span className="choice-key font-semibold mr-2">{key}.</span>
                <span>{label}</span>
              </label>
            ))}

            {stepResult?.explanations?.[current.id] && (
              <div className="explanation mt-3 p-3 border-l-4 border-[#b91c1c] bg-[#fff0f0] text-[#b91c1c] rounded-md">
                ❗ 해설: {stepResult.explanations[current.id]}
              </div>
            )}
          </motion.section>
        </AnimatePresence>

        {!isLast ? (
          <button
            className="next-btn w-full py-3 rounded-lg bg-[#624e3e] text-white font-semibold hover:bg-[#3e2e25] transition"
            disabled={!answers[current.id] || submitting}
            onClick={submitOneAndUnlock}
          >
            {submitting ? "채점 중…" : "다음 문제 →"}
          </button>
        ) : (
          <>
            {!finalResult ? (
              <button
                className="next-btn w-full py-3 rounded-lg bg-[#624e3e] text-white font-semibold hover:bg-[#3e2e25] transition"
                disabled={submitting || steps.some(s => !answers[s.id])}
                onClick={submitAllAtEnd}
              >
                {submitting ? "채점 중…" : "최종 결과 보기 →"}
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="result-box text-center bg-[#fffaf6] border border-[#e6d7c9] rounded-2xl p-6 shadow-inner mt-6"
              >
                <h3 className="text-2xl font-bold text-[#624e3e] mb-2">🎉 수고했어요!</h3>
                <p className="text-gray-700 mb-4">
                  총{" "}
                  <span className="font-bold text-[#624e3e]">
                    {finalResult.total_correct}
                  </span>{" "}
                  문제 정답! ({steps.length}문제 중)
                </p>
                <p className="text-sm text-gray-600 mb-6">
                  틀린 문항은 아래 해설을 통해 복습해보세요 👇
                </p>

                {finalResult.explanations &&
                  Object.keys(finalResult.explanations).length > 0 && (
                    <div className="explanations-list text-left bg-[#fffaf5] border border-[#e6d7c9] rounded-xl p-4">
                      <h4 className="font-semibold mb-2 text-[#5c4435]">🧐 해설 보기</h4>
                      {Object.entries(finalResult.explanations as Record<string, string>).map(
                        ([stepId, text]) => {
                          const step = steps.find(s => s.id === Number(stepId));
                          return (
                            <div key={stepId} className="mb-3 border-t pt-2">
                              <p className="font-medium text-sm text-gray-700">
                                {step
                                  ? `Q${step.step_order}. ${step.question}`
                                  : `문항 ${stepId}`}
                              </p>
                              <p className="text-gray-600 text-sm mt-1">{text}</p>
                            </div>
                          );
                        }
                      )}
                    </div>
                  )}

                <button
                  className="complete-btn mt-6 px-6 py-3 rounded-lg bg-[#624e3e] text-white font-semibold hover:bg-[#3e2e25]"
                  onClick={() => nav("/scenarios")}
                >
                  목록으로 돌아가기
                </button>
              </motion.div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
