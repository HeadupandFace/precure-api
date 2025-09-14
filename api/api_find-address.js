// pages/api/find-address.js
export default async function handler(req, res) {
  const { postcode } = req.query;

  if (!postcode || typeof postcode !== 'string') {
    return res.status(400).json({ error: 'A valid postcode is required' });
  }

  try {
    const response = await fetch(`https://api.postcodes.io/postcodes/${postcode}`);
    const data = await response.json();

    if (data.status !== 200) {
      return res.status(data.status).json({ error: data.error || 'Invalid postcode' });
    }

    if (!data.result) {
      return res.status(404).json({ error: 'Postcode not found' });
    }

    const { result } = data;
    const sampleAddresses = [
      { id: '1', line1: `1 Example Street, ${result.postcode}` },
      { id: '2', line1: `2 Example Street, ${result.postcode}` },
    ];

    res.status(200).json(sampleAddresses);

  } catch (error) {
    console.error('Postcode lookup failed:', error);
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
}