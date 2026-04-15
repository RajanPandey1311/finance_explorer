import React, { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { StatCard } from './StatCard';
import { DataVisualizer } from './DataVisualizer';
import { formatCurrency } from '../utils/formatters';
import { FiDollarSign, FiActivity, FiBriefcase, FiBarChart2, FiPieChart, FiFileText, FiTable } from 'react-icons/fi';
import { exportToCSV, exportToPDF } from '../utils/exportUtils';

export const FinancialDashboard: React.FC = () => {
  const { searchedCompany, loading, error } = useFinance();

  const metrics = useMemo(() => {
    if (!searchedCompany || !searchedCompany.facts['us-gaap']) return null;

    const gaap = searchedCompany.facts['us-gaap'];

    const getLatest = (keys: string[]) => {
      for (const key of keys) {
        const concept = gaap[key];
        if (!concept?.units?.USD) continue;

        const facts = concept.units.USD.filter(f => f.form === '10-K' || f.form === '10-Q');
        if (!facts.length) continue;

        const latest = facts.reduce((prev, curr) =>
          new Date(curr.end) > new Date(prev.end) ? curr : prev
        );
        return { value: latest.val, year: latest.fy };
      }
      return null;
    };

    const getSeries = (keys: string[]) => {
      for (const key of keys) {
        if (gaap[key]?.units?.USD) return gaap[key].units.USD;
      }
      return [];
    };

    const revenueKeys = ['Revenues', 'SalesRevenueNet', 'RevenueFromContractWithCustomerExcludingAssessedTax'];
    const netIncomeKeys = ['NetIncomeLoss'];
    const assetKeys = ['Assets'];
    const liabilityKeys = ['Liabilities'];

    return {
      name: searchedCompany.entityName,
      cik: searchedCompany.cik.toString().padStart(10, '0'),
      revenue: getLatest(revenueKeys),
      netIncome: getLatest(netIncomeKeys),
      assets: getLatest(assetKeys),
      liabilities: getLatest(liabilityKeys),
      revenueSeries: getSeries(revenueKeys),
      netIncomeSeries: getSeries(netIncomeKeys),
    };
  }, [searchedCompany]);

  const onExportCSV = () => metrics && exportToCSV({
    companyName: metrics.name,
    cik: metrics.cik,
    revenues: metrics.revenueSeries,
    netIncome: metrics.netIncomeSeries,
  });

  const onExportPDF = () => metrics && exportToPDF({
    companyName: metrics.name,
    cik: metrics.cik,
    revenues: metrics.revenueSeries,
    netIncome: metrics.netIncomeSeries,
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
        <div className="w-12 h-12 border-[3px] border-slate-100 border-t-emerald-500 rounded-full animate-spin mb-4" />
        <p className="text-slate-400 font-bold text-xs tracking-widest uppercase">Fetching SEC Filings</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card mt-8 p-10 border-rose-100 bg-rose-50/30">
        <div className="flex items-center gap-4 text-rose-600 mb-6">
          <div className="p-3 bg-rose-100 rounded-xl">
            <FiActivity className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">System Notice</h2>
        </div>
        <p className="text-slate-600 font-medium leading-relaxed max-w-lg">{error}</p>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="mt-12 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-10 border-b border-slate-100">
        <div>
          <span className="inline-block px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded-md mb-4">
            Identity: {metrics.cik}
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
            {metrics.name}
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onExportCSV}
            className="flex items-center gap-2.5 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-95 group"
          >
            <FiTable className="w-4 h-4 text-emerald-500 group-hover:rotate-12 transition-transform" />
            <span className="text-xs font-bold tracking-wide">Download CSV</span>
          </button>
          <button
            onClick={onExportPDF}
            className="flex items-center gap-2.5 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-95 group"
          >
            <FiFileText className="w-4 h-4 text-cyan-400 font-bold" />
            <span className="text-xs font-bold tracking-wide">Download PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Revenue (TTM)"
          value={metrics.revenue ? formatCurrency(metrics.revenue.value) : '—'}
          subtitle={metrics.revenue ? `Fiscal Year ${metrics.revenue.year}` : undefined}
          icon={FiBarChart2}
          color="emerald"
        />
        <StatCard
          title="Net Profit"
          value={metrics.netIncome ? formatCurrency(metrics.netIncome.value) : '—'}
          subtitle={metrics.netIncome ? `Fiscal Year ${metrics.netIncome.year}` : undefined}
          icon={FiDollarSign}
          color="blue"
        />
        <StatCard
          title="Total Capital"
          value={metrics.assets ? formatCurrency(metrics.assets.value) : '—'}
          subtitle={metrics.assets ? `Fiscal Year ${metrics.assets.year}` : undefined}
          icon={FiBriefcase}
          color="purple"
        />
        <StatCard
          title="Liabilities"
          value={metrics.liabilities ? formatCurrency(metrics.liabilities.value) : '—'}
          subtitle={metrics.liabilities ? `Fiscal Year ${metrics.liabilities.year}` : undefined}
          icon={FiPieChart}
          color="rose"
        />
      </div>

      <div className="mt-6">
        <DataVisualizer
          revenues={metrics.revenueSeries}
          netIncome={metrics.netIncomeSeries}
        />
      </div>
    </div>
  );
};

