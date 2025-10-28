// src/pages/scenarios/ScenarioLanding.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import useRequireAuth from "../../hooks/useRequireAuth";
import { listScenarios } from "../../api/scenario";

type ScenarioBrief = { scenario_id: number; name: string; description: string };

export default function ScenarioLanding() {
  useRequireAuth(); // 미로그인 → 카카오 로그인
  const nav = useNavigate();
  const [items, setItems] = useState<ScenarioBrief[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const data = await listScenarios();
        console.log("[/quiz/scenarios] resp =", data); // ✅ 디버그
        setItems(Array.isArray(data) ? data : []);
      } catch (e: any) {
        console.error(e);
        setErr(e?.response?.data?.detail ?? "시나리오 목록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="page-wrapper">
      <div className="header-fixed"><Header /></div>
      <main className="page-content" style={{ maxWidth: 1080, margin: "0 auto" }}>
        <h1 className="text-2xl font-bold mb-4">시나리오 기반 퀴즈</h1>

        {loading && <p>불러오는 중…</p>}
        {err && <div className="error-box">{err}</div>}

        {!loading && !err && items.length === 0 && (
          <>
            <p className="text-center text-gray-600 mt-10">준비된 시나리오가 없습니다.</p>
            {/* 필요 시 주석 해제해 값 확인 */}
            {/* <pre style={{whiteSpace:"pre-wrap",fontSize:12}}>{JSON.stringify(items,null,2)}</pre> */}
          </>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((s) => (
            <article key={s.scenario_id} className="border rounded-lg p-4">
              <h3 className="font-bold">{s.name}</h3>
              <p className="text-sm text-gray-600">{s.description}</p>
              <button
                className="mt-3 px-3 py-2 rounded-md bg-[#5c4435] text-white"
                onClick={() => nav(`/scenarios/${s.scenario_id}`)}
              >
                시작하기
              </button>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
