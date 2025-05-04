export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { molecule_name } = req.body;

    const prompt = `You are now PharmaBot or PB. Provide comprehensive insights on ${molecule_name} tablets, including:
    - Brand name, dosage, and administration details.
    - Drug molecule details (structure, weight, solubility, BCS class, mechanism, properties).
    - Absorption, Distribution, Metabolism, Excretion, and Elimination.
    - Information on inactive ingredients, packaging, and storage conditions.
    - Insights from the Orange Book (approval dates, patent information).
    - Dissolution conditions from the OGD database and product-specific BE requirements.
    - Restrict responses to regulatory sources (US FDA, EMA, TGA), including references.`;

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer API_KEY`, // Replace with your actual API key
        },
        body: JSON.stringify({
          //model: 'openai/gpt-4.1',
          model: 'deepseek/deepseek-prover-v2:free',
          //"max_tokens": 2000,
          messages: [
            {
              role: 'system',
              content: 'You are PharmaBot. Provide regulatory insights on drug molecules.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API responded with status ${response.status}`);
      }

      await new Promise(resolve => setTimeout(resolve, 30000)); // Pause for 30 seconds before processing the response
      const responseText = await response.text();
      console.log('Raw API Response:', responseText);
      const data = JSON.parse(responseText);
      console.log('API Json Response:', data);
      const insights = data.choices && data.choices[0]?.message?.content;
      res.status(200).json({ insights: insights || 'No data available' });
    } catch (error) {
      console.error('Error fetching data from OpenRouter API:', error);
      res.status(500).json({ error: 'Failed to fetch data from Grok LLM API' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}