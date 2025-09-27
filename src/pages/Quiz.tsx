import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import "./Quiz.css";

type QuizItem = { id: number; question: string; category: string };
type AnswerItem = { quiz_id: number; answer: "O" | "X" };
type SubmitResponse = { total_correct: number; category_correct_count: Record<string, number> };
type ResultResponse = { category_correct_count: Record<string, number> };

// ✅ 공통 axios 인스턴스 (헤더 고정)
const api = axios.create({
  baseURL: "https://2lawon.com/api",
  headers: { "Content-Type": "application/json" },
});

const Quiz = () => {
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [answers, setAnswers] = useState<Record<number, "O" | "X">>({});
  const [submitResult, setSubmitResult] = useState<SubmitResponse | null>(null);
  const [historyResult, setHistoryResult] = useState<ResultResponse | null>(null);

  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ 퀴즈 가져오기
  const fetchQuizzes = async () => {
    if (loadingFetch) return;
    setLoadingFetch(true);
    setError(null);
    try {
      const { data } = await api.get<QuizItem[]>("/quiz");
      setQuizzes(data);
      // 새로 시작하므로 상태 초기화
      setAnswers({});
      setSubmitResult(null);
      setHistoryResult(null);
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? "퀴즈를 불러오지 못했습니다.");
    } finally {
      setLoadingFetch(false);
    }
  };

  // ✅ 정답 선택
  const selectAnswer = (quizId: number, value: "O" | "X") => {
    setAnswers((prev) => ({ ...prev, [quizId]: value }));
  };

  // ✅ 정답 제출
  const handleSubmitAnswers = async () => {
    if (loadingSubmit) return;

    // 모든 문항 답했는지 체크
    const unanswered = quizzes.filter((q) => !answers[q.id]);
    if (unanswered.length) {
      alert(`${unanswered.length}개 문항이 미답변입니다.`);
      return;
    }

    setLoadingSubmit(true);
    setError(null);
    try {
      // 형식/타입/대소문자 보정 (백엔드 스키마 호환)
      const payload = {
        answers: quizzes.map<AnswerItem>((q) => ({
          quiz_id: Number(q.id),
          answer:
            String(answers[q.id] ?? "")
              .trim()
              .toUpperCase() === "O"
              ? "O"
              : "X",
        })),
      };

      const { data } = await api.post<SubmitResponse>("/quiz/answer", payload);
      setSubmitResult(data);
      // 제출 후 누적 결과는 초기화하지 않음(사용자 선택)
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? "정답 제출 실패");
    } finally {
      setLoadingSubmit(false);
    }
  };

  // ✅ 누적 정답률 조회
  const fetchHistory = async () => {
    if (loadingHistory) return;
    setLoadingHistory(true);
    setError(null);
    try {
      const { data } = await api.get<ResultResponse>("/quiz/result");
      setHistoryResult(data);
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? "결과 조회 실패");
    } finally {
      setLoadingHistory(false);
    }
  };

  // ✅ 전체 로딩 상태 (버튼 비활성화용)
  const isBusy = loadingFetch || loadingSubmit || loadingHistory;

  return (
    <div className="page-wrapper">
      <div className="header-fixed">
        <Header />
      </div>

      <main className="page-content">
        <h2 className="quiz-title">노동법 퀴즈</h2>

        {/* 퀴즈 불러오기 버튼 */}
        <div className="quiz-actions">
          <button onClick={fetchQuizzes} disabled={isBusy}>
            {loadingFetch ? "불러오는 중..." : "퀴즈 풀러가기"}
          </button>
        </div>

        {/* 에러 메시지 */}
        {error && <div className="error-box">{error}</div>}

        {/* 퀴즈 표시 */}
        {quizzes.length > 0 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmitAnswers();
            }}
            className="quiz-form"
          >
            <ul>
              {quizzes.map((quiz, idx) => (
                <li key={quiz.id} className="quiz-item">
                  <div className="quiz-category">
                    #{idx + 1} · {quiz.category}
                  </div>
                  <div className="quiz-question">{quiz.question}</div>
                  <div className="quiz-options">
                    <button
                      type="button"
                      className={answers[quiz.id] === "O" ? "selected" : ""}
                      onClick={() => selectAnswer(quiz.id, "O")}
                      disabled={isBusy}
                    >
                      O
                    </button>
                    <button
                      type="button"
                      className={answers[quiz.id] === "X" ? "selected" : ""}
                      onClick={() => selectAnswer(quiz.id, "X")}
                      disabled={isBusy}
                    >
                      X
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* 두 개의 버튼 */}
            <div className="quiz-buttons">
              <button type="submit" disabled={isBusy}>
                {loadingSubmit ? "채점 중..." : "정답확인하기"}
              </button>
              <button type="button" onClick={fetchHistory} disabled={isBusy}>
                {loadingHistory ? "조회 중..." : "퀴즈 정답률 조회하기"}
              </button>
            </div>
          </form>
        )}

        {/* 정답 제출 결과 */}
        {submitResult && (
          <div className="result-box">
            <h3>채점 결과</h3>
            <p>
              맞춘 개수: {submitResult.total_correct} / {quizzes.length}
            </p>
            <ul>
              {Object.entries(submitResult.category_correct_count).map(([cat, cnt]) => (
                <li key={cat}>
                  {cat}: {cnt}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 정답률 조회 결과 */}
        {historyResult && (
          <div className="result-box">
            <h3>누적 결과</h3>
            <ul>
              {Object.entries(historyResult.category_correct_count).map(([cat, cnt]) => (
                <li key={cat}>
                  {cat}: {cnt}
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Quiz;
