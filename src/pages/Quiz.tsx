import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import "./Quiz.css";
import ResultCharts from "./ResultCharts";

type QuizItem = { id: number; question: string; category: string };
type AnswerItem = { quiz_id: number; answer: "O" | "X" };
type SubmitResponse = { total_correct: number; category_correct_count: Record<string, number> };
type ResultResponse = { category_correct_count: Record<string, number> };

// ✅ 카카오 로그인 시작 URL
const KAKAO_START_URL = "https://2lawon.com/api/users/login/kakao";

// ✅ axios 인스턴스 (+ 토큰 자동 첨부, 401시 카카오 로그인)
const api = axios.create({
  baseURL: "https://2lawon.com/api",
  headers: { "Content-Type": "application/json" },
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});
api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) {
      const rt = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.href = `${KAKAO_START_URL}?return_to=${rt}`;
      return;
    }
    return Promise.reject(err);
  }
);

export default function Quiz() {
  // 인증 체크
  const [authed, setAuthed] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      const rt = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.href = `${KAKAO_START_URL}?return_to=${rt}`;
      return;
    }
    setAuthed(true);
  }, []);

  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [answers, setAnswers] = useState<Record<number, "O" | "X">>({});
  const [idx, setIdx] = useState(0); // ← 현재 문항 인덱스 (0-based)

  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [submitResult, setSubmitResult] = useState<SubmitResponse | null>(null);
  const [historyResult, setHistoryResult] = useState<ResultResponse | null>(null);

  const isBusy = loadingFetch || loadingSubmit || loadingHistory;

  const progress = useMemo(() => {
    if (!quizzes.length) return 0;
    const answeredCount = quizzes.filter((q) => answers[q.id]).length;
    return Math.round((answeredCount / quizzes.length) * 100);
  }, [answers, quizzes]);

  const current = quizzes[idx];

  // 퀴즈 로드 (시작하기 버튼)
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
      setIdx(0);
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? "퀴즈를 불러오지 못했습니다.");
    } finally {
      setLoadingFetch(false);
    }
  };

  const choose = (qid: number, val: "O" | "X") => {
    setAnswers((prev) => ({ ...prev, [qid]: val }));
  };

  const goPrev = () => {
    if (idx > 0) setIdx((v) => v - 1);
  };
  const goNext = () => {
    if (idx < quizzes.length - 1) setIdx((v) => v + 1);
  };

  // 최종 제출
  const submitAll = async () => {
    if (loadingSubmit) return;

    // 미답변 체크
    const unanswered = quizzes.filter((q) => !answers[q.id]);
    if (unanswered.length) {
      alert(`${unanswered.length}개 문항이 미답변입니다.`);
      // 첫 미답변 위치로 이동
      const firstMissing = quizzes.findIndex((q) => !answers[q.id]);
      if (firstMissing >= 0) setIdx(firstMissing);
      return;
    }

    setLoadingSubmit(true);
    setError(null);
    try {
      const payload = {
        answers: quizzes.map<AnswerItem>((q) => ({
          quiz_id: Number(q.id),
          answer: String(answers[q.id]).trim().toUpperCase() === "O" ? "O" : "X",
        })),
      };
      const { data } = await api.post<SubmitResponse>("/quiz/answer", payload);
      setSubmitResult(data);
      // 결과가 나오면 맨 위로 스크롤(모바일 대비)
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? "정답 제출 실패");
    } finally {
      setLoadingSubmit(false);
    }
  };

  // 누적 결과
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

        {/* 시작하기 / 기록보기 */}
        {quizzes.length === 0 && (
          <div className="quiz-actions">
            <button onClick={fetchQuizzes} disabled={isBusy}>
              {loadingFetch ? "불러오는 중..." : "시작하기"}
            </button>
            <button onClick={fetchHistory} disabled={isBusy}>
              {loadingHistory ? "조회 중..." : "누적 결과 보기"}
            </button>
          </div>
        )}

        {/* 에러 */}
        {error && <div className="error-box">{error}</div>}

        {/* 진행바 */}
        {quizzes.length > 0 && (
          <div className="progress-wrap">
            <div className="progress-label">
              {idx + 1} / {quizzes.length} ({progress}%)
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* 한 문제씩 표시 */}
        {current && (
          <div className="quiz-one">
            <div className="quiz-category">[{current.category}]</div>
            <div className="quiz-question">{current.question}</div>

            <div className="quiz-one-options">
              <button
                type="button"
                className={answers[current.id] === "O" ? "selected" : ""}
                onClick={() => choose(current.id, "O")}
                disabled={isBusy}
              >
                O
              </button>
              <button
                type="button"
                className={answers[current.id] === "X" ? "selected" : ""}
                onClick={() => choose(current.id, "X")}
                disabled={isBusy}
              >
                X
              </button>
            </div>

            {/* 네비게이션 */}
            <div className="quiz-one-nav">
              <button onClick={goPrev} disabled={idx === 0 || isBusy}>
                이전
              </button>

              {idx < quizzes.length - 1 ? (
                <button
                  onClick={goNext}
                  disabled={!answers[current.id] || isBusy}
                >
                  다음
                </button>
              ) : (
                <button
                  onClick={submitAll}
                  disabled={!answers[current.id] || isBusy}
                >
                  {loadingSubmit ? "채점 중..." : "정답확인하기"}
                </button>
              )}
            </div>
          </div>
        )}

        {/* 제출 결과 */}
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

        {/* 누적 결과 - 인라인 차트 */}
        {loadingHistory && (
          <div className="result-box animate-pulse">
            <div className="h-4 w-32 bg-gray-200 rounded mb-3" />
            <div className="h-48 w-full bg-gray-100 rounded mb-3" />
            <div className="h-48 w-full bg-gray-100 rounded" />
          </div>
        )}
        {historyResult && !loadingHistory && (
          <ResultCharts
            title="누적 결과(카테고리 분포에 따라)  "
            categoryCorrect={historyResult.category_correct_count}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
