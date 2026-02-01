'use client';

import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Despesa } from "@/data/mockDeputies";

interface ExpenseChartProps {
  expenses: Despesa[];
}

export function ExpenseChart({ expenses }: ExpenseChartProps) {
  // Agrupa despesas por categoria
  const expensesByCategory = expenses.reduce((acc, expense) => {
    const existing = acc.find(item => item.category === expense.categoria);
    if (existing) {
      existing.value += expense.valor;
    } else {
      acc.push({
        category: expense.categoria,
        value: expense.valor
      });
    }
    return acc;
  }, [] as { category: string; value: number }[]);

  // Limita às top 8 categorias para melhor visualização
  const topCategories = expensesByCategory
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  // Formata os valores para exibição
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Trunca nomes longos de categorias
  const truncateCategory = (category: string, maxLength: number = 20) => {
    if (category.length <= maxLength) return category;
    return category.substring(0, maxLength) + '...';
  };

  if (expenses.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Nenhuma despesa registrada no período
      </div>
    );
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={topCategories} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="category" 
            angle={-45}
            textAnchor="end"
            height={100}
            tickFormatter={truncateCategory}
          />
          <YAxis 
            tickFormatter={(value) => {
              if (value >= 1000) {
                return `R$${(value / 1000).toFixed(0)}k`;
              }
              return `R$${value}`;
            }}
          />
          <Tooltip 
            formatter={(value: number) => [formatCurrency(value), 'Valor']}
            labelFormatter={(label) => `Categoria: ${label}`}
          />
          <Bar 
            dataKey="value" 
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}