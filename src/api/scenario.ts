// src/api/scenario.ts
import api from "../utils/api";

// ✅ 시나리오 목록 타입(컴포넌트에서는 scenario_id 사용)
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
  id: number; // 상세는 id로 통일
  name: string;
  description: string;
  steps: ScenarioStep[];
};

// ✅ 요청/응답 타입
export type ScenarioAnswerReq = {
  answers: { step_id: number; answer: string }[];
};

export type ScenarioAnswerRes = {
  total_correct: number;
  category_correct_count: Record<string, number>;
  unlocked_step_ids: number[];
  explanations: Record<string, string>;
};

// =====================
// ✅ 실제 API 함수들
// =====================

// 🔧 목록
export const listScenarios = async (): Promise<ScenarioBrief[]> => {
  const { data } = await api.get("/quiz/scenarios");
  const arr = Array.isArray(data)
    ? data
    : Array.isArray((data as any)?.items)
    ? (data as any).items
    : [];
  return arr.map((it: any) => ({
    scenario_id: Number(it.scenario_id ?? it.id),
    name: String(it.name ?? ""),
    description: String(it.description ?? ""),
  }));
};

// 🔧 상세
export const getScenario = async (id: string | number): Promise<ScenarioDetail> => {
  const { data } = await api.get(`/quiz/scenarios/${id}`);
  return {
    id: Number((data as any)?.id ?? (data as any)?.scenario_id ?? id),
    name: String((data as any)?.name ?? ""),
    description: String((data as any)?.description ?? ""),
    steps: Array.isArray((data as any)?.steps) ? (data as any).steps : [],
  };
};

// ✅ 정답 제출 (백엔드 라우트에 맞게 수정)
export const submitScenarioAnswers = async (
  id: string | number,
  payload: ScenarioAnswerReq
): Promise<ScenarioAnswerRes> => {
  const { data } = await api.post(`/quiz/scenarios/answers`, payload); // ✅ 수정된 부분
  return data as ScenarioAnswerRes;
};
