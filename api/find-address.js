// Vercel Serverless Function to act as an API endpoint for postcode address lookup.

export default async function handler(req, res) {
  try {
    // 1. Extract the postcode from the query string.
    const { postcode } = req.query;

    // 2. Validate that a postcode was provided.
    if (!postcode) {
      return res.status(400).json({ error: 'Postcode is required' });
    }

    // 3. Fetch data from the Postcodes.io API.
    const response = await fetch(`https://api.postcodes.io/postcodes/${postcode}`);

    // Check if the response is ok before parsing
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // 4. Handle errors from the Postcodes.io API.
    if (data.status !== 200) {
      throw new Error(data.error || 'Invalid postcode');
    }

    // 5. Extract addresses from the API response.
    const addresses = data.result?.addresses || []; // Access addresses safely

    // Check if addresses were found
    if (addresses.length === 0) {
        return res.status(404).json({ error: 'No addresses found for this postcode.' });
    }

    // Format the addresses (adjust based on the actual API response structure)
    const formattedAddresses = addresses.map((address, index) => ({
        id: String(index + 1), // Generate a unique ID
        line1: address.line_1 || `Address Line 1, ${postcode}`, // Use actual address data if available
        line2: address.line_2 || null, // Example of handling optional fields
        town: address.town || null,
        postcode: address.postcode || postcode
    }));

    // 6. Send the list of formatted addresses back to the client.
    res.status(200).json(formattedAddresses);

  } catch (error) {
    // 7. Handle any errors that occur during the process.
    console.error('Postcode lookup failed:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch addresses.' }); // Include error message
  }
}