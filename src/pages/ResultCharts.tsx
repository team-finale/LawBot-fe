// src/pages/ResultCharts.tsx
import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend
} from "recharts";

type Props = {

  categoryCorrect: Record<string, number>;
  title?: string
};

const COLORS = ["#111827","#4B5563","#9CA3AF","#D1D5DB","#6B7280","#374151","#A3A3A3","#525252"];

export default function ResultCharts({ categoryCorrect, title = "누적 결과" }: Props) {
  const data = useMemo(() => {
    const entries = Object.entries(categoryCorrect || {});
    return entries
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [categoryCorrect]);

  const total = useMemo(() => data.reduce((s, d) => s + d.value, 0), [data]);

  if (!data.length) {
    return <div className="result-box">표시할 데이터가 없습니다.</div>;
  }

  return (
    <div className="result-box">
      <div className="flex items-baseline justify-between gap-3 mb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className="text-sm text-gray-500">총 정답 수: {total}</span>
      </div>

      {/* 막대그래프 */}
      <div style={{ width: "100%", height: 240 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 도넛 차트 — percent(unknown) 대신 value/total로 직접 계산 */}
      <div style={{ width: "100%", height: 240, marginTop: 16 }}>
        <ResponsiveContainer>
          <PieChart>
            <Legend verticalAlign="bottom" height={24} />
            <Tooltip />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              // ✅ 여기서 percent를 쓰지 않습니다. (TS 에러 회피)
              label={(d: any) => {
                const name = String(d?.name ?? "");
                const value = Number(d?.value ?? 0);
                const pct = total ? Math.round((value / total) * 100) : 0;
                return `${name} ${pct}%`;
              }}
              labelLine={false}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
