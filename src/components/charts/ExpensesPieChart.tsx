import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ExpensesPieChartProps {
  data: { name: string; value: number }[];
  title?: string;
}

const COLORS = [
  "hsl(221, 83%, 53%)",  // chart-1
  "hsl(142, 76%, 36%)",  // chart-2
  "hsl(45, 93%, 47%)",   // chart-3
  "hsl(280, 65%, 60%)",  // chart-4
  "hsl(0, 84%, 60%)",    // chart-5
  "hsl(190, 90%, 40%)",  // chart-6
  "hsl(221, 70%, 70%)",
  "hsl(142, 60%, 50%)",
  "hsl(45, 80%, 55%)",
  "hsl(280, 50%, 70%)",
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
  }).format(value);
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-card p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground">{payload[0].name}</p>
        <p className="text-sm text-primary font-semibold">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export function ExpensesPieChart({ data, title = "Despesas por Categoria" }: ExpensesPieChartProps) {
  const topData = data.slice(0, 6);
  const othersValue = data.slice(6).reduce((sum, item) => sum + item.value, 0);
  
  const chartData = othersValue > 0 
    ? [...topData, { name: "Outros", value: othersValue }]
    : topData;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    className="stroke-card stroke-2"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => (
                  <span className="text-xs text-muted-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
