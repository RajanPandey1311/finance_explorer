export default async function handler(req, res) {
  const { cik } = req.query;

  if (!cik) {
    return res.status(400).json({ error: 'CIK parameter is required' });
  }

  try {
    const response = await fetch(`https://data.sec.gov/api/xbrl/companyfacts/CIK${cik}.json`, {
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
