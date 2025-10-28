// src/api/scenario.ts
import api from "../utils/api";

// ✅ 시나리오 목록 타입
export type ScenarioBrief = {
  scenario_id: number;
  name: string;
  description: string;
};

// ✅ 시나리오 상세 타입
export type ScenarioStep = {
  id: number;
  step_order: number;
  question: string;
  choices: Record<string, string>;
  category?: string;
  is_unlocked?: boolean;
};

export type ScenarioDetail = {
  id: number; // ✅ 상세에서는 id
  name: string;
  description: string;
  steps: ScenarioStep[];
};

// ✅ 요청: 선택한 답안 목록
export type ScenarioAnswerReq = {
  answers: {
    step_id: number;
    answer: string; // "A" | "B" | ...
  }[];
};

// ✅ 응답: 정답/해설/잠금 해제 스텝
export type ScenarioAnswerRes = {
  total_correct: number;
  category_correct_count: Record<string, number>;
  unlocked_step_ids: number[];
  explanations: Record<string, string>; // "11": "해설..."
};

// =====================
// ✅ 실제 API 함수들
// =====================
export const listScenarios = async () => {
  const { data } = await api.get<ScenarioBrief[]>("/quiz/scenarios");
  return data;
};

export const getScenario = async (id: string | number) => {
  const { data } = await api.get<ScenarioDetail>(`/quiz/scenarios/${id}`);
  return data;
};

export const submitScenarioAnswers = async (
  id: string | number,
  payload: ScenarioAnswerReq
) => {
  const { data } = await api.post<ScenarioAnswerRes>(
    `/quiz/scenarios/${id}/answers`,
    payload
  );
  return data;
};
