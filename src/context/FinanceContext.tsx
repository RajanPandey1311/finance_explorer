import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { CompanyTicker, CompanyFacts } from '../types/finance';

interface FinanceContextType {
  tickers: Record<string, CompanyTicker>;
  searchedCompany: CompanyFacts | null;
  loading: boolean;
  error: string | null;
  searchCompany: (query: string) => Promise<void>;
  clearSearch: () => void;
  isInitialLoading: boolean;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tickers, setTickers] = useState<Record<string, CompanyTicker>>({});
  const [searchedCompany, setSearchedCompany] = useState<CompanyFacts | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickers = async () => {
      try {
        const response = await fetch('/api/tickers');
        if (!response.ok) {
          throw new Error('Failed to load company tickers');
        }
        const data = await response.json();
        setTickers(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred building ticker dictionary.');
        }
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchTickers();
  }, []);

  const searchCompany = async (query: string) => {
    setLoading(true);
    setError(null);
    setSearchedCompany(null);
    
    try {
      const q = query.trim().toUpperCase();
      let cikToFetch: string | null = null;

      const items = Object.values(tickers);
      const matched = items.find(
        (item) => item.ticker === q || item.title.toUpperCase().includes(q) || item.cik_str.toString() === q
      );

      if (matched) {
        const cikString = matched.cik_str.toString().padStart(10, '0');
        cikToFetch = cikString;
      } else if (!isNaN(Number(q))) {
        cikToFetch = q.padStart(10, '0');
      }

      if (!cikToFetch) {
        throw new Error('Company not found. Ensure valid ticker, CIK, or name.');
      }

      const response = await fetch(`/api/company?cik=${cikToFetch}`);
      if (!response.ok) {
        throw new Error('Company data could not be fetched. They might not use XBRL standard.');
      }

      const data = await response.json();
      setSearchedCompany(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch data.');
      }
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchedCompany(null);
    setError(null);
  };

  return (
    <FinanceContext.Provider
      value={{
        tickers,
        searchedCompany,
        loading,
        error,
        searchCompany,
        clearSearch,
        isInitialLoading
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};
