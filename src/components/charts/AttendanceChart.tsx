import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { AttendanceStats, VotingStats } from "@/data/mockDeputies";

interface AttendanceChartProps {
  attendance: AttendanceStats;
  voting: VotingStats;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-card p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function AttendanceChart({ attendance, voting }: AttendanceChartProps) {
  const data = [
    {
      name: "Presença em Sessões",
      Presentes: attendance.presencas,
      Ausências: attendance.ausenciasJustificadas + attendance.ausenciasNaoJustificadas,
    },
    {
      name: "Participação em Votações",
      Presentes: voting.presentes,
      Ausências: voting.ausentes + voting.abstencoes,
    },
  ];

  return (
    <div className="h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis type="number" tick={{ fontSize: 12 }} />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 11 }}
            width={120}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey="Presentes"
            fill="hsl(142, 76%, 36%)"
            stackId="a"
            radius={[0, 4, 4, 0]}
          />
          <Bar
            dataKey="Ausências"
            fill="hsl(0, 84%, 60%)"
            stackId="a"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
