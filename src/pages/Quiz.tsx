import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import "./Quiz.css";

type QuizItem = { id: number; question: string; category: string };
type AnswerItem = { quiz_id: number; answer: "O" | "X" };
type SubmitResponse = { total_correct: number; category_correct_count: Record<string, number> };
type ResultResponse = { category_correct_count: Record<string, number> };

const Quiz = () => {
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [answers, setAnswers] = useState<Record<number, "O" | "X">>({});
  const [submitResult, setSubmitResult] = useState<SubmitResponse | null>(null);
  const [historyResult, setHistoryResult] = useState<ResultResponse | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ 퀴즈 가져오기
  const fetchQuizzes = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get<QuizItem[]>("https://2lawon.com/api/quiz");
      setQuizzes(data);
      setAnswers({});
      setSubmitResult(null);
      setHistoryResult(null);
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? "퀴즈를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ 정답 선택
  const selectAnswer = (quizId: number, value: "O" | "X") => {
    setAnswers((prev) => ({ ...prev, [quizId]: value }));
  };

  // ✅ 정답 제출
  const handleSubmitAnswers = async () => {
    if (quizzes.some((q) => !answers[q.id])) {
      alert("모든 문항에 답해주세요.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        answers: quizzes.map<AnswerItem>((q) => ({
          quiz_id: q.id,
          answer: answers[q.id],
        })),
      };
      const { data } = await axios.post<SubmitResponse>("https://2lawon.com/api/quiz/answer", payload);
      setSubmitResult(data);
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? "정답 제출 실패");
    } finally {
      setLoading(false);
    }
  };

  // ✅ 정답률 조회
  const fetchHistory = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get<ResultResponse>("https://2lawon.com/api/quiz/result");
      setHistoryResult(data);
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? "결과 조회 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="header-fixed">
        <Header />
      </div>

      <main className="page-content">
        <h2 className="quiz-title">노동법 퀴즈</h2>

        {/* 퀴즈 불러오기 버튼 */}
        <div className="quiz-actions">
          <button onClick={fetchQuizzes} disabled={loading}>
            {loading ? "불러오는 중..." : "퀴즈 풀러가기"}
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
                    >
                      O
                    </button>
                    <button
                      type="button"
                      className={answers[quiz.id] === "X" ? "selected" : ""}
                      onClick={() => selectAnswer(quiz.id, "X")}
                    >
                      X
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* 두 개의 버튼 */}
            <div className="quiz-buttons">
              <button type="submit" disabled={loading}>
                정답확인하기
              </button>
              <button type="button" onClick={fetchHistory} disabled={loading}>
                퀴즈 정답률 조회하기
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
