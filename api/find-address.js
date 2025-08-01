// This is a Vercel Serverless Function that will act as our API endpoint.

export default async function handler(req, res) {
  // 1. Get the postcode sent from the mobile app.
  // We expect it to be in the query string, like: /api/find-address?postcode=BD13AD
  const { postcode } = req.query;

  // 2. Basic validation to make sure a postcode was provided.
  if (!postcode) {
    return res.status(400).json({ error: 'Postcode is required' });
  }

  try {
    // 3. Make a request to the live Postcodes.io API.
    const response = await fetch(`https://api.postcodes.io/postcodes/${postcode}`);
    const data = await response.json();

    // 4. Check if Postcodes.io returned an error (e.g., invalid postcode).
    if (data.status !== 200) {
      throw new Error(data.error || 'Invalid postcode');
    }

    // This part is for a different type of lookup, but we'll leave it for now.
    // We need to implement the address lookup part.
    // For now, let's just return a success message.
    
    // In a real implementation, you would extract addresses from 'data.result'
    // For now, we'll return a sample based on your previous request.
    const sampleAddresses = [
      { id: '1', line1: `1 Example Street, ${postcode}` },
      { id: '2', line1: `2 Example Street, ${postcode}` },
    ];

    // 5. Send the list of addresses back to the mobile app.
    res.status(200).json(sampleAddresses);

  } catch (error) {
    // 6. If anything goes wrong, send back an error message.
    console.error('Postcode lookup failed:', error);
    res.status(500).json({ error: 'Failed to fetch addresses.' });
  }
}