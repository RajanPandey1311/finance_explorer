import { FinanceProvider } from './context/FinanceContext';
import { CompanySearch } from './components/CompanySearch';
import { FinancialDashboard } from './components/FinancialDashboard';
import { FiTrendingUp } from 'react-icons/fi';

function App() {
  return (
    <FinanceProvider>
      <div className="min-h-screen p-4 md:p-8 flex flex-col relative z-10 selection:bg-emerald-500/10 selection:text-emerald-900 transition-colors duration-500">
        <header className="w-full max-w-7xl mx-auto flex items-center justify-between py-6 mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <FiTrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Data<span className="text-emerald-500">Explorer</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase">Private Capital Explorer</p>
            </div>
          </div>
        </header>

        <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col">
          <section className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
              Institutional Grade <br />
              <span className="text-gradient">Fundamental Data.</span>
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto font-medium">
              Native SEC EDGAR integration for instant fundamentals.
              Search thousands of U.S. public filings with zero friction.
            </p>
          </section>

          <CompanySearch />
          <FinancialDashboard />
        </main>

        <footer className="w-full max-w-7xl mx-auto mt-24 py-12 border-t border-slate-200 text-center text-slate-400 text-xs font-medium tracking-wide">
          <p>© {new Date().getFullYear()} DataExplorer Intelligence. Powered by SEC EDGAR. Not financial advice.</p>
        </footer>

      </div>
    </FinanceProvider>
  );
}

export default App;

