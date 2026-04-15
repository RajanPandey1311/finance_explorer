import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiX, FiTrendingUp } from 'react-icons/fi';
import { useFinance } from '../context/FinanceContext';
import clsx from 'clsx';
import type { CompanyTicker } from '../types/finance';

export const CompanySearch: React.FC = () => {
  const { searchCompany, tickers, loading, isInitialLoading, clearSearch } = useFinance();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CompanyTicker[]>([]);
  const [active, setActive] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) {
      setResults([]);
      return;
    }

    const dict = Object.values(tickers);
    const filtered = dict.filter(item => 
      item.ticker.toLowerCase().includes(q) || 
      item.title.toLowerCase().includes(q) ||
      item.cik_str.toString().includes(q)
    ).slice(0, 6);

    setResults(filtered);
  }, [query, tickers]);

  useEffect(() => {
    const out = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActive(false);
      }
    };
    document.addEventListener('mousedown', out);
    return () => document.removeEventListener('mousedown', out);
  }, []);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setActive(false);
      searchCompany(query);
    }
  };

  const onPick = (ticker: string) => {
    setQuery(ticker);
    setActive(false);
    searchCompany(ticker);
  };

  const onReset = () => {
    setQuery('');
    setResults([]);
    clearSearch();
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto z-50">
      <form onSubmit={onSearch} className="relative group">
        <div className={clsx(
          "absolute inset-0 bg-emerald-500 rounded-2xl blur-xl opacity-0 transition-opacity duration-700",
          active ? "opacity-10" : "group-hover:opacity-5"
        )} />
        <div className="relative bg-white border border-slate-200 rounded-2xl flex items-center p-2 shadow-sm transition-all duration-300 focus-within:border-emerald-500/50 focus-within:shadow-xl focus-within:shadow-emerald-500/5">
          <div className="pl-4 pr-2 text-slate-300">
            <FiSearch className={clsx("w-5 h-5 transition-colors", active && "text-emerald-500")} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setActive(true)}
            placeholder={isInitialLoading ? "Syncing database..." : "Enter ticker or company name..."}
            disabled={isInitialLoading || loading}
            className="w-full bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400 py-3 px-2 text-lg font-bold tracking-tight disabled:opacity-50"
          />
          {query && (
            <button
              type="button"
              onClick={onReset}
              className="p-2 mr-2 text-slate-300 hover:text-slate-500 transition-colors rounded-xl hover:bg-slate-50"
            >
              <FiX className="w-5 h-5" />
            </button>
          )}
          <button
            type="submit"
            disabled={!query.trim() || loading || isInitialLoading}
            className="bg-slate-900 text-white font-bold py-3 px-8 rounded-xl transition-all hover:bg-black disabled:opacity-50 shadow-lg active:scale-95"
          >
            {loading ? '...' : 'Search'}
          </button>
        </div>
      </form>

      {active && results.length > 0 && (
        <div 
          ref={menuRef}
          className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        >
          <ul className="py-2">
            {results.map((x) => (
              <li key={x.cik_str}>
                <button
                  type="button"
                  onClick={() => onPick(x.ticker)}
                  className="w-full text-left px-6 py-4 hover:bg-slate-50 transition-colors flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 group-hover:border-emerald-200 group-hover:bg-white transition-all">
                    <FiTrendingUp className="text-slate-400 group-hover:text-emerald-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-900 font-bold truncate text-sm">{x.title}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                       <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 rounded uppercase tracking-wider">{x.ticker}</span>
                       <span className="text-[10px] font-bold text-slate-400">CIK {x.cik_str.toString().padStart(10, '0')}</span>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

