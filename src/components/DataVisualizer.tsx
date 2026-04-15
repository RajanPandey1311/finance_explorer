import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import type { FinancialFact } from '../types/finance';
import { formatCurrency } from '../utils/formatters';

interface DataVisualizerProps {
  revenues: FinancialFact[];
  netIncome: FinancialFact[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-100 shadow-xl">
        <p className="font-bold text-slate-800 mb-3 text-sm tracking-tight">{`Fiscal Year ${label}`}</p>
        <div className="space-y-2">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <div 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-slate-500 text-xs font-semibold">{entry.name}:</span>
              </div>
              <span className="text-slate-900 font-bold text-xs">
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const DataVisualizer: React.FC<DataVisualizerProps> = ({ revenues, netIncome }) => {
  const chartData = useMemo(() => {
    const yearsMap = new Map<number, any>();

    const capture = (fact: FinancialFact, key: string) => {
      if (fact.form !== '10-K') return;
      
      const year = fact.fy;
      if (!yearsMap.has(year)) yearsMap.set(year, { year });
      
      const entry = yearsMap.get(year);
      if (!entry[key] || new Date(fact.end) > new Date(entry[`${key}Date`] || '1970-01-01')) {
        entry[key] = fact.val;
        entry[`${key}Date`] = fact.end;
      }
    };

    revenues.forEach(f => capture(f, 'Revenue'));
    netIncome.forEach(f => capture(f, 'Net Income'));

    return Array.from(yearsMap.values())
      .filter(d => d.Revenue !== undefined || d['Net Income'] !== undefined)
      .sort((a, b) => a.year - b.year)
      .slice(-5); 
  }, [revenues, netIncome]);

  if (!chartData.length) {
    return (
      <div className="glass-card flex items-center justify-center p-10 h-[400px]">
        <p className="text-slate-400 font-medium italic">Data insufficient for annual performance visualization.</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-8 h-[450px] flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-3">
          <span className="w-1.5 h-6 rounded-full bg-emerald-500" />
          Financial Trajectory
        </h3>
      </div>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
            <XAxis 
              dataKey="year" 
              stroke="#94a3b8" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
              dy={15}
            />
            <YAxis 
              stroke="#94a3b8"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
              tickFormatter={(val) => `$${(val / 1e9).toFixed(0)}B`}
              dx={-10}
            />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ fill: '#f8fafc', radius: 8 }} 
            />
            <Legend 
              verticalAlign="top"
              align="right"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ paddingBottom: '30px', fontSize: '12px', fontWeight: 600, color: '#64748b' }}
            />
            <Bar 
              name="Revenue"
              dataKey="Revenue" 
              fill="#10b981" 
              radius={[6, 6, 0, 0]} 
              maxBarSize={45}
            />
            <Bar 
              name="Net Income"
              dataKey="Net Income" 
              fill="#3b82f6" 
              radius={[6, 6, 0, 0]} 
              maxBarSize={45}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

