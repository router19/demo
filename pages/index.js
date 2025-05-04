import { useState } from 'react';

export default function Home() {
  const [moleculeName, setMoleculeName] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const formatResponse = (response) => {
    return response.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\-\-/g, '<hr>');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/pharma', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ molecule_name: moleculeName }),
    });
    const data = await res.json();
    setResponse(formatResponse(data.insights || 'No data available'));
    setLoading(false);
  };

  return (
    <div>
      <h1>Drug Insights</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter molecule name"
          value={moleculeName}
          onChange={(e) => setMoleculeName(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      <div>
        <h2>Response:</h2>
        {loading ? <p>Loading...</p> : <p dangerouslySetInnerHTML={{ __html: response }} />}
      </div>
    </div>
  );
}