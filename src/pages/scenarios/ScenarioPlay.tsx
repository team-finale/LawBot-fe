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

/** ✅ 타입 정의 */
type ScenarioResult = {
  total_correct: number;
  explanations: Record<string, string>;
};

export default function ScenarioPlay() {
  useRequireAuth();
  const { scenarioId } = useParams();
  const nav = useNavigate();

  /** 상태 정의 */
  const [detail, setDetail] = useState<ScenarioDetail | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [ setStepResult] = useState<ScenarioResult | null>(null);
  const [finalResult, setFinalResult] = useState<ScenarioResult | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /** 시나리오 로드 */
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

  /** 에러 처리 */
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

  /** 로딩 상태 */
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

  /** 현재 문제 */
  const steps = detail.steps;
  const current = steps[currentIdx];
  const isLast = currentIdx === steps.length - 1;
  const progressPercent = ((currentIdx + 1) / steps.length) * 100;

  /** 단일 문항 제출 */
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

      // ✅ 감정형 피드백
      if (res.total_correct > 0) setFeedback("✅ 정답이에요! 잘했어요 🎉");
      else setFeedback("❌ 아쉬워요! 다시 한 번 생각해봐요 💭");

      if (!isLast) setTimeout(() => setCurrentIdx(i => i + 1), 1200);
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? e?.message ?? "정답 제출 실패");
    } finally {
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  /** 전체 제출 */
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

  /** 렌더링 */
  return (
    <div className="page-wrapper">
      <div className="header-fixed"><Header /></div>
      <main className="page-content max-w-xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-[#624e3e] mb-2">{detail.name}</h1>
        <p className="text-gray-600 mb-6">{detail.description}</p>

        {/* ✅ 진행 게이지 */}
        <div className="progress-bar-wrap mb-8">
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
          <span className="progress-text">{currentIdx + 1} / {steps.length}</span>
        </div>

        {/* ✅ 현재 문제 카드 */}
        <AnimatePresence mode="wait">
          <motion.section
            key={current.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="scenario-card"
          >
            <h3 className="font-semibold text-lg mb-4 text-[#3e2e25]">
              💭 {current.question}
            </h3>

            {Object.entries(current.choices).map(([key, label]) => (
              <motion.label
                key={key}
                whileTap={{ scale: 0.97 }}
                className={`choice ${answers[current.id] === key ? "active" : ""}`}
              >
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
              </motion.label>
            ))}

            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="feedback-box"
              >
                {feedback}
              </motion.div>
            )}
          </motion.section>
        </AnimatePresence>

        {/* ✅ 버튼 및 결과 */}
        {!isLast ? (
          <button
            className="next-btn w-full"
            disabled={!answers[current.id] || submitting}
            onClick={submitOneAndUnlock}
          >
            {submitting ? "채점 중…" : "다음 문제 →"}
          </button>
        ) : (
          <>
            {!finalResult ? (
              <button
                className="next-btn w-full"
                disabled={submitting || steps.some(s => !answers[s.id])}
                onClick={submitAllAtEnd}
              >
                {submitting ? "채점 중…" : "최종 결과 보기 →"}
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="result-box text-center"
              >
                <h3 className="text-2xl font-bold text-[#624e3e] mb-2">🎉 미션 클리어!</h3>
                <p className="text-gray-700 mb-4">
                  총{" "}
                  <span className="font-bold text-[#624e3e]">
                    {finalResult.total_correct}
                  </span>{" "}
                  문제 정답! ({steps.length}문제 중)
                </p>
                <p className="text-sm text-gray-600 mb-6">
                  틀린 문항은 해설을 보고 복습해볼까요? 👇
                </p>

                {finalResult.explanations &&
                  Object.keys(finalResult.explanations).length > 0 && (
                    <div className="explanations-list text-left">
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
                  className="complete-btn mt-6"
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
