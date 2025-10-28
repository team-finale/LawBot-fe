// src/pages/scenarios/ScenarioLanding.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import useRequireAuth from "../../hooks/useRequireAuth";
import { listScenarios, type ScenarioBrief } from "../../api/scenario";

export default function ScenarioLanding() {
  useRequireAuth();
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
        const arr = Array.isArray(data) ? data.slice() : [];
        arr.sort((a, b) => a.scenario_id - b.scenario_id);
        setItems(arr);
      } catch (e: any) {
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
        <h1 className="text-2xl font-bold mb-4">
          실제 상황을 기반으로 한 문제를 풀어보세요 : 시나리오 기반 퀴즈
        </h1>

        {loading && (
          <div className="grid gap-4 sm:grid-cols-2">
            {[...Array(2)].map((_,i)=>(
              <div key={i} className="border rounded-lg p-4 animate-pulse">
                <div className="h-5 w-40 bg-gray-200 rounded mb-2" />
                <div className="h-4 w-72 bg-gray-100 rounded" />
                <div className="h-8 w-24 bg-gray-200 rounded mt-3" />
              </div>
            ))}
          </div>
        )}

        {err && (
          <>
            <div className="error-box">{err}</div>
            <button className="mt-3 px-3 py-2 rounded-md border" onClick={() => location.reload()}>
              다시 시도
            </button>
          </>
        )}

        {!loading && !err && items.length === 0 && (
          <p className="text-center text-gray-600 mt-10">준비된 시나리오가 없습니다.</p>
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
