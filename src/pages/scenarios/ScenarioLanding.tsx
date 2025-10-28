import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import useRequireAuth from "../../hooks/useRequireAuth";
import { listScenarios, type ScenarioBrief } from "../../api/scenario";
import "./scenario.css";

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
        setErr(e?.response?.data?.detail ?? e?.message ?? "시나리오 로드 실패");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="page-wrapper">
        <Header />
        <main className="page-content flex justify-center items-center h-[60vh] text-gray-600">
          로딩 중...
        </main>
        <Footer />
      </div>
    );
  }

  if (err) {
    return (
      <div className="page-wrapper">
        <Header />
        <main className="page-content text-center py-20">
          <h2 className="text-2xl font-bold mb-2 text-[#624e3e]">시나리오 불러오기 실패</h2>
          <p className="text-gray-600 mb-4">{err}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Header />
      <main className="page-content text-center py-10 px-4 bg-[#fffaf5]">
        <h2 className="text-2xl font-bold text-[#624e3e] mb-2">⚔️ 노동권 미션 선택</h2>
        <p className="text-gray-600 mb-6">
          각 시나리오는 현실 속 노동 문제를 바탕으로 구성되어 있습니다.<br />
          상황을 분석하고, 올바른 결정을 내려 미션을 클리어하세요!
        </p>

        <p className="text-sm text-gray-500 mb-8">
          {items.length}개의 시나리오 준비됨
        </p>

        <div className="scenario-grid">
          {items.map((s) => (
            <motion.div
              key={s.scenario_id}
              whileHover={{ scale: 1.03, y: -4 }}
              transition={{ duration: 0.2 }}
              className="scenario-card-landing"
            >
              <h3 className="text-sm font-semibold text-[#8b735b] mb-1">
                Lv.{s.scenario_id}
              </h3>
              <h4 className="font-bold text-[#624e3e] text-lg mb-2">
                {s.name}
              </h4>
              <p className="text-gray-600 text-sm mb-5">{s.description}</p>
              <button
                onClick={() => nav(`/scenarios/${s.scenario_id}`)}
                className="start-btn"
              >
                🚀 도전 시작하기
              </button>
            </motion.div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
