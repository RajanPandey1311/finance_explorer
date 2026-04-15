import React from 'react';
import clsx from 'clsx';
import type { IconType } from 'react-icons';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: IconType;
  color?: 'emerald' | 'blue' | 'purple' | 'rose' | 'amber';
}

const colorMap = {
  emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
  blue: 'text-blue-600 bg-blue-50 border-blue-100',
  purple: 'text-purple-600 bg-purple-50 border-purple-100',
  rose: 'text-rose-600 bg-rose-50 border-rose-100',
  amber: 'text-amber-600 bg-amber-50 border-amber-100',
};

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon,
  color = 'blue'
}) => {
  return (
    <div className="glass-card flex flex-col p-6 h-full relative overflow-hidden group">
      <div className={clsx(
        "absolute -right-6 -top-6 w-24 h-24 rounded-full blur-3xl opacity-10 transition-all duration-700 group-hover:scale-150 group-hover:opacity-20",
        colorMap[color].split(' ')[1].replace('bg-', 'bg-') 
      )} />
      
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-[11px] font-bold text-slate-400 tracking-[0.15em] uppercase">
          {title}
        </h3>
        <div className={clsx(
          "p-2.5 rounded-xl border transition-transform duration-300 group-hover:scale-110",
          colorMap[color]
        )}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      <div className="mt-auto relative">
        <p className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-slate-500 font-semibold tracking-wide">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

