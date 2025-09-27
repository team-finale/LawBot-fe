import Header from "../components/Header";
import Footer from "../components/Footer";
import "./quiz.css";

import { useMemo, useState } from "react";
import axios from "axios";

type QuizItem = {
  quiz_id: number;
  category: string;
  question: string;
};

type AnswerPayload = { quiz_id: number; answer: "O" | "X" };

type SubmitAnswersResult = {
  total_correct: number;
  total_count: number;
  by_category: { category: string; correct: number; total: number }[];
  items?: { quiz_id: number; correct: boolean }[];
};

type Step = "start" | "play" | "review" | "stats";

// 🔑 기본 API URL
const BASE = "https://2lawon.com";

const Quiz = () => {
  const [step, setStep] = useState<Step>("start");
  const [items, setItems] = useState<QuizItem[]>([]);
  const [selected, setSelected] = useState<Record<number, "O" | "X">>({});
  const [result, setResult] = useState<SubmitAnswersResult | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 카테고리별 그룹
  const grouped = useMemo(
    () =>
      items.reduce((m, q) => {
        (m[q.category] ||= []).push(q);
        return m;
      }, {} as Record<string, QuizItem[]>),
    [items]
  );

  // 1) 퀴즈 불러오기
  async function startQuiz() {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE}/api/quiz`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        withCredentials: true,
      });
      setItems(res.data.quizzes); // ⚠️ 응답이 배열이면 res.data로 교체
      setSelected({});
      setResult(null);
      setStep("play");
    } catch (e) {
      alert("퀴즈 불러오기 실패");
    } finally {
      setLoading(false);
    }
  }

  // 2) 선택
  function choose(id: number, ans: "O" | "X") {
    setSelected((prev) => ({ ...prev, [id]: ans }));
  }

  // 3) 정답 제출
  async function checkAnswers() {
    const answers: AnswerPayload[] = Object.entries(selected).map(
      ([id, ans]) => ({ quiz_id: Number(id), answer: ans as "O" | "X" })
    );
    if (!answers.length) return alert("최소 1문제 이상 선택하세요!");

    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE}/api/quiz/answer`,
        { answers },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          withCredentials: true,
        }
      );
      setResult(res.data);
      setStep("review");
    } catch (e) {
      alert("정답 제출 실패");
    } finally {
      setLoading(false);
    }
  }

  // 4) 결과 조회
  async function showStats() {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE}/api/quiz/result?user_id=1`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        withCredentials: true,
      });
      setStats(res.data);
      setStep("stats");
    } catch (e) {
      alert("결과 조회 실패");
    } finally {
      setLoading(false);
    }
  }

  // --- 화면 ---
  const renderContent = () => {
    if (step === "start")
      return (
        <button className="btn btn-primary" onClick={startQuiz} disabled={loading}>
          {loading ? "불러오는 중…" : "퀴즈 풀러 가기"}
        </button>
      );

    if (step === "play")
      return (
        <div>
          {Object.entries(grouped).map(([cat, qs]) => (
            <div key={cat} className="quiz-category">
              <div className="quiz-category-title">[{cat}]</div>
              {qs.map((q) => (
                <div key={q.quiz_id} className="quiz-question">
                  <div className="quiz-question-text">{q.question}</div>
                  <div className="quiz-options">
                    <button
                      onClick={() => choose(q.quiz_id, "O")}
                      className={selected[q.quiz_id] === "O" ? "o-btn selected" : "o-btn"}
                    >
                      O
                    </button>
                    <button
                      onClick={() => choose(q.quiz_id, "X")}
                      className={selected[q.quiz_id] === "X" ? "x-btn selected" : "x-btn"}
                    >
                      X
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
          <div className="quiz-actions">
            <button className="btn" onClick={() => setStep("start")}>처음으로</button>
            <button className="btn" onClick={checkAnswers}>정답 확인</button>
          </div>
        </div>
      );

    if (step === "review" && result)
      return (
        <div>
          <div className="quiz-result-summary">
            총 정답: {result.total_correct} / {result.total_count}
          </div>
          <div className="quiz-result-category">
            {result.by_category.map((c) => (
              <div key={c.category}>
                {c.category}: {c.correct}/{c.total}
              </div>
            ))}
          </div>
          <div className="quiz-actions">
            <button className="btn" onClick={startQuiz}>다시 풀기</button>
            <button className="btn btn-primary" onClick={showStats}>결과 보기</button>
          </div>
        </div>
      );

    if (step === "stats" && stats)
      return (
        <div>
          전체 정답률:{" "}
          {stats.overall_total
            ? Math.round((stats.overall_correct / stats.overall_total) * 100)
            : 0}
          %
          <div className="quiz-result-category">
            {stats.stats.map((s: any) => (
              <div key={s.category}>
                {s.category}: {s.correct}/{s.total}
              </div>
            ))}
          </div>
          <button className="btn" onClick={() => setStep("start")}>처음으로</button>
        </div>
      );

    return null;
  };

  return (
    <div className="page-wrapper">
      <div className="header-fixed">
        <Header />
      </div>
      <div className="quiz-wrapper">{renderContent()}</div>
      <Footer />
    </div>
  );
};

export default Quiz;
