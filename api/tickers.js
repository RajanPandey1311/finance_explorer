export default async function handler(req, res) {
  try {
    const response = await fetch('https://www.sec.gov/files/company_tickers.json', {
      headers: {
        'User-Agent': 'finance test@finance.com'
      }
    });

    if (!response.ok) {
      throw new Error(`SEC API responded with status: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
