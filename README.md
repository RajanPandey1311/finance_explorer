# DataExplorer — SEC Financial Intelligence

A clean, high-performance financial data visualizer built to interface directly with the SEC EDGAR API. DataExplorer provides institutional-grade fundamental analysis tools for U.S. public companies, designed with a focus on speed, clarity, and data portability.

## Core Features

- **Blazing Fast Identity Search**: Instant autocomplete mapping for thousands of active SEC stickers, company names, and CIK identifiers.
- **Native EDGAR Integration**: Real-time retrieval of XBRL company facts from `data.sec.gov`, bypasses typical CORS hurdles via integrated development proxies.
- **Financial Visualization**: Automated parsing of annual 10-K filings to visualize 5-year trajectories for revenue and net profitability.
- **CSV & PDF Portability**: One-click generation of structured CSV data and professional PDF financial reports for external analysis.
- **Premium Light Aesthetic**: A modern, high-contrast interface built with Tailwind CSS v4, emphasizing a "glassmorphic" light theme and fluid micro-interactions.

## Tech Stack

- **Core**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 (Oxide engine)
- **Visualization**: Recharts
- **Exports**: jsPDF + jspdf-autotable
- **Connectivity**: React Context API + Native Fetch

## Getting Started

1. **Install Dependencies**  
   ```bash
   npm install
   ```
2. **Launch Environment**  
   The Vite configuration is pre-wired to proxy requests to the SEC servers with the required identity headers.
   ```bash
   npm run dev
   ```
3. **Analyze**  
   Visit `http://localhost:5173` and search for a company (e.g., AAPL, TSLA, or Microsoft) to begin the analysis.

## Key Considerations

- **XBRL Mapping**: The SEC returns exhaustive datasets. We intelligently map GAAP aliases (like `SalesRevenueNet` or `Revenues`) to normalize records across different corporate reporting styles.
- **SEC Rate Limits**: The EDGAR API enforces a limit of 10 requests per second. The application handles requests efficiently to remain compliant with these thresholds.
- **Data Period**: To maintain focus on recent performance, the visualizer graphs the most recent 5 fiscal years found in available 10-K records.

## Deployment

The project includes `/api` handlers that are ready for **Vercel Serverless** deployment, ensuring that the necessary proxy logic for SEC data remains functional in a production environment.

