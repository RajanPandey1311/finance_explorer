export interface CompanyTicker {
  cik_str: number;
  ticker: string;
  title: string;
}

export interface FinancialFact {
  end: string;
  val: number;
  accn: string;
  fy: number;
  fp: string;
  form: string;
  filed: string;
  frame?: string;
}

export interface FinancialConcept {
  label: string;
  description: string;
  units: {
    USD?: FinancialFact[];
    shares?: FinancialFact[];
    'USD/shares'?: FinancialFact[];
  };
}

export interface CompanyFacts {
  cik: number;
  entityName: string;
  facts: {
    'us-gaap': Record<string, FinancialConcept>;
    dei?: Record<string, FinancialConcept>;
  };
}
