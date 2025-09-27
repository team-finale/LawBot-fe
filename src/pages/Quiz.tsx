import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import "./Quiz.css";

type QuizItem = { id: number; question: string; category: string };
type AnswerItem = { quiz_id: number; answer: "O" | "X" };
type SubmitResponse = { total_correct: number; category_correct_count: Record<string, number> };
type ResultResponse = { category_correct_count: Record<string, number> };

// ✅ 카카오 로그인 시작 URL
const KAKAO_START_URL = "https://2lawon.com/api/users/login/kakao";

// ✅ axios 인스턴스
const api = axios.create({
  baseURL: "https://2lawon.com/api",
  headers: { "Content-Type": "application/json" },
});

// ✅ 토큰 자동 첨부 + 401 시 카카오 로그인으로 이동
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      window.location.href = KAKAO_START_URL;
      return;
    }
    return Promise.reject(err);
  }
);

const Quiz = () => {
  const [authed, setAuthed] = useState<boolean>(false);
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [answers, setAnswers] = useState<Record<number, "O" | "X">>({});
  const [submitResult, setSubmitResult] = useState<SubmitResponse | null>(null);
  const [historyResult, setHistoryResult] = useState<ResultResponse | null>(null);

  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ 마운트 시 로그인 여부 확인
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      window.location.href = KAKAO_START_URL;
      return;
    }
    setAuthed(true);
  }, []);

  // ✅ 퀴즈 가져오기
  const fetchQuizzes = async () => {
    if (loadingFetch) return;
    setLoadingFetch(true);
    setError(null);
    try {
      const { data } = await api.get<QuizItem[]>("/quiz");
      setQuizzes(data);
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

    const unanswered = quizzes.filter((q) => !answers[q.id]);
    if (unanswered.length) {
      alert(`${unanswered.length}개 문항이 미답변입니다.`);
      return;
    }

    setLoadingSubmit(true);
    setError(null);
    try {
      const payload = {
        answers: quizzes.map<AnswerItem>((q) => ({
          quiz_id: Number(q.id),
          answer: String(answers[q.id] ?? "").trim().toUpperCase() === "O" ? "O" : "X",
        })),
      };

      const { data } = await api.post<SubmitResponse>("/quiz/answer", payload);
      setSubmitResult(data);
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

  const isBusy = loadingFetch || loadingSubmit || loadingHistory;

  if (!authed) {
    return (
      <div className="page-wrapper">
        <main className="page-content">
          <p style={{ textAlign: "center", marginTop: 100 }}>접근 권한 확인 중…</p>
        </main>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="header-fixed">
        <Header />
      </div>

      <main className="page-content">
        <h2 className="quiz-title">노동법 퀴즈</h2>

        <div className="quiz-actions">
          <button onClick={fetchQuizzes} disabled={isBusy}>
            {loadingFetch ? "불러오는 중..." : "퀴즈 풀러가기"}
          </button>
        </div>

        {error && <div className="error-box">{error}</div>}

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
