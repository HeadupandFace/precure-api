// Vercel Serverless Function: Robust Postcode Address Lookup via Postcodes.io

export default async function handler(req, res) {
  try {
    // 1. Extract and validate postcode from query
    const { postcode } = req.query;

    if (!postcode || typeof postcode !== 'string' || postcode.trim().length === 0) {
      return res.status(400).json({ error: 'A valid postcode is required' });
    }

    const trimmedPostcode = postcode.trim();

    // 2. Fetch data from Postcodes.io API
    const response = await fetch(`https://api.postcodes.io/postcodes/${trimmedPostcode}`);

    if (!response.ok) {
      console.error(`Postcodes.io responded with status ${response.status} for postcode: ${trimmedPostcode}`);
      return res.status(502).json({ error: 'Upstream postcode service failed.' });
    }

    const data = await response.json();

    // 3. Validate API response structure
    if (data.status !== 200 || !data.result) {
      const errorMessage = data.error || 'Invalid postcode or missing result';
      console.error(`Postcode lookup failed: ${errorMessage} for postcode: ${trimmedPostcode}`);
      return res.status(data.status || 500).json({ error: errorMessage });
    }

    // 4. Extract and validate address array
    const rawAddresses = Array.isArray(data.result.addresses) ? data.result.addresses : [];

    if (rawAddresses.length === 0) {
      return res.status(404).json({ error: 'No addresses found for this postcode.' });
    }

    // 5. Format each address safely
    const formatAddress = (address, index, fallbackPostcode) => ({
      id: String(index + 1),
      line1: address?.line_1 || `Address Line 1, ${fallbackPostcode}`,
      line2: address?.line_2 || null,
      town: address?.town || null,
      postcode: address?.postcode || fallbackPostcode
    });

    const formattedAddresses = rawAddresses
      .filter((addr) => typeof addr === 'object' && addr !== null)
      .map((address, index) => formatAddress(address, index, trimmedPostcode));

    // 6. Optional: CORS header for cross-origin requests
    res.setHeader('Access-Control-Allow-Origin', '*');

    // 7. Return formatted addresses
    return res.status(200).json(formattedAddresses);

  } catch (error) {
    console.error('Postcode lookup failed:', error);
    return res.status(500).json({
      error: (error instanceof Error ? error.message : 'Failed to fetch addresses.')
    });
  }
}