// src/pages/ResultCharts.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend
} from "recharts";

type Props = {
  categoryCorrect: Record<string, number>;
  title?: string;
};

const PALETTE = ["#5c4435","#6B7280","#111827","#9CA3AF","#D1D5DB","#374151","#A3A3A3","#525252"];

export default function ResultCharts({ categoryCorrect, title = "누적 결과" }: Props) {
  // 화면 폭에 따라 축/폰트/라벨 정책을 바꾸기 위한 뷰포트 체크
  const [vw, setVw] = useState<number>(() => (typeof window !== "undefined" ? window.innerWidth : 1280));
  useEffect(() => {
    const onR = () => setVw(window.innerWidth);
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, []);
  const isSm = vw < 640;     // ~sm
  const isMd = vw >= 640 && vw < 1024;

  const data = useMemo(() => {
    const entries = Object.entries(categoryCorrect || {});
    return entries
      .map(([name, value]) => ({ name, value: Number(value) || 0 }))
      .filter(d => d.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [categoryCorrect]);

  const total = useMemo(() => data.reduce((s, d) => s + d.value, 0), [data]);

  // 빈 데이터 처리
  if (!data.length) {
    return <div className="result-box">표시할 데이터가 없습니다.</div>;
  }

  // 카테고리 라벨 축약 (모바일일수록 더 짧게)
  const labelLen = isSm ? 6 : isMd ? 8 : 12;
  const trim = (s: string) => (s.length > labelLen ? s.slice(0, labelLen) + "…" : s);

  // X축 틱 각도/간격 계산
  const tickAngle = isSm ? -25 : isMd ? -15 : 0;
  // 너무 많으면 라벨 간격 띄우기
  const maxTicks = isSm ? 5 : isMd ? 8 : 12;
  const tickInterval = data.length > maxTicks ? Math.ceil(data.length / maxTicks) - 1 : 0;

  // 도넛 반지름(모바일에서 조금 작게)
  const innerR = isSm ? 48 : 60;
  const outerR = isSm ? 78 : 92;

  return (
    <div className="result-box" aria-label={`${title} 차트`} role="group">
      <div className="flex items-baseline justify-between gap-3 mb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className="text-sm text-gray-500">맞춘 문제 수: {total}</span>
      </div>

      {/* 막대그래프 */}
      <div style={{ width: "100%", height: isSm ? 220 : 260 }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 8, right: 12, left: 0, bottom: isSm || isMd ? 12 : 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: isSm ? 10 : 12 }}
              angle={tickAngle}
              textAnchor={tickAngle ? "end" : "middle"}
              interval={tickInterval as any}
              tickFormatter={trim}
            />
            <YAxis allowDecimals={false} />
            <Tooltip
              formatter={(v: any, _name, _p) => [v, "맞춘 수"]}
              labelFormatter={(name) => String(name)}
            />
            <Bar
              dataKey="value"
              radius={[6, 6, 0, 0]}
              fill="#9CA3AF"
              activeBar={{ fill: "#5c4435" }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 도넛 차트 */}
      <div style={{ width: "100%", height: isSm ? 220 : 260, marginTop: 16 }}>
        <ResponsiveContainer>
          <PieChart>
            <Legend
              verticalAlign="bottom"
              height={isSm ? 40 : 48}
              wrapperStyle={{ fontSize: isSm ? 11 : 12 }}
            />
            <Tooltip
              formatter={(v: any, name: any) => {
                const val = Number(v) || 0;
                const pct = total ? Math.round((val / total) * 100) : 0;
                return [`${val}개 (${pct}%)`, String(name)];
              }}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={innerR}
              outerRadius={outerR}
              paddingAngle={2}
              labelLine={false}
              label={(d: any) => {
                const name = String(d?.name ?? "");
                const value = Number(d?.value ?? 0);
                const pct = total ? Math.round((value / total) * 100) : 0;
                // 모바일에선 라벨 길이 축약
                return `${trim(name)} ${pct}%`;
              }}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
