import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import useRequireAuth from "../../hooks/useRequireAuth";
import { listScenarios, type ScenarioBrief } from "../../api/scenario";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="page-wrapper bg-[#fffdfc] min-h-screen">
      <div className="header-fixed"><Header /></div>
      <main className="page-content max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-[#624e3e] mb-3 text-center">
          🎯 실제 상황을 바탕으로 한 시나리오 퀴즈
        </h1>
        <p className="text-center text-gray-600 mb-10">
          선택한 시나리오 속에서 현실적인 노동 이슈를 해결해보세요.
        </p>

        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border rounded-2xl p-6 animate-pulse bg-gray-100 h-40" />
            ))}
          </div>
        )}

        {err && (
          <div className="text-center">
            <div className="error-box text-red-600 font-medium mb-3">{err}</div>
            <button
              className="px-4 py-2 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
              onClick={() => location.reload()}
            >
              다시 시도
            </button>
          </div>
        )}

        {!loading && !err && items.length === 0 && (
          <p className="text-center text-gray-600 mt-10">준비된 시나리오가 없습니다.</p>
        )}

        <AnimatePresence>
          <motion.div
            layout
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {items.map((s, idx) => (
              <motion.article
                key={s.scenario_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="border border-[#e5d6c3] bg-[#fffaf6] rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                <h3 className="font-bold text-lg text-[#3e2e25] mb-2">{s.name}</h3>
                <p className="text-sm text-gray-700 line-clamp-3 mb-4">{s.description}</p>
                <button
                  className="w-full py-2.5 rounded-md bg-[#624e3e] text-white font-semibold hover:bg-[#3e2e25] transition"
                  onClick={() => nav(`/scenarios/${s.scenario_id}`)}
                >
                  시작하기 →
                </button>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
