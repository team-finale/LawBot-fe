import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import useRequireAuth from "../../hooks/useRequireAuth";
import { listScenarios, type ScenarioBrief } from "../../api/scenario";
import { motion, AnimatePresence } from "framer-motion";
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
        setErr(e?.response?.data?.detail ?? "시나리오 목록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="page-wrapper">
      <div className="header-fixed"><Header /></div>
      <main className="page-content max-w-6xl mx-auto px-4 py-16 text-center">
        <motion.h1
          className="text-4xl font-extrabold text-[#624e3e] mb-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          ⚔️ 노동권 미션 선택
        </motion.h1>
        <p className="text-gray-600 mb-10">
          각 시나리오는 현실 속 노동 문제를 바탕으로 구성되어 있습니다.<br />
          상황을 분석하고, 올바른 결정을 내려 미션을 클리어하세요!
        </p>

        {/* 진행률 바 */}
        <div className="progress-wrapper mb-12">
          <div className="progress-bar" style={{ width: `${(items.length / 6) * 100}%` }} />
          <span className="progress-label">{items.length}개의 시나리오 준비됨</span>
        </div>

        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border rounded-2xl p-6 animate-pulse bg-gray-100 h-40" />
            ))}
          </div>
        )}

        {err && (
          <div className="text-center">
            <div className="error-box">{err}</div>
            <button className="retry-btn" onClick={() => location.reload()}>
              다시 시도
            </button>
          </div>
        )}

        {!loading && !err && items.length === 0 && (
          <p className="text-center text-gray-600 mt-10">준비된 시나리오가 없습니다.</p>
        )}

        <AnimatePresence>
          <motion.div layout className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((s, idx) => (
              <motion.article
                key={s.scenario_id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ scale: 1.04, rotate: 0.3 }}
                transition={{ delay: idx * 0.1 }}
                className="scenario-card-game"
              >
                <div className="badge">Lv.{idx + 1}</div>
                <h3 className="font-bold text-xl mb-1">{s.name}</h3>
                <p className="text-gray-700 text-sm mb-4 line-clamp-3">{s.description}</p>
                <button
                  className="play-btn"
                  onClick={() => nav(`/scenarios/${s.scenario_id}`)}
                >
                  🚀 도전 시작하기
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
