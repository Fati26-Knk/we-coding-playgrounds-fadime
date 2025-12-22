import { useState, useEffect } from 'react';

interface BearData {
  name: string;
  binomial: string;
  image: string;
  range: string;
}

interface WikipediaApiResponse {
  parse?: {
    wikitext: {
      '*': string;
    };
  };
  query?: {
    pages: Record<
      string,
      {
        imageinfo?: Array<{
          url: string;
        }>;
      }
    >;
  };
  error?: {
    info: string;
  };
}

function BearList() {
  const [bears, setBears] = useState<BearData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const PLACEHOLDER_IMAGE = '/placeholder-bear.svg';
  // Use relative URL - Vite proxy will forward to backend
  const BACKEND_API_URL = '/api/bears';

  useEffect(() => {
    const loadBearData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch bear data from our backend API via Vite proxy
        console.log('📊 Fetching bear data from backend API...');
        const response = await fetch(BACKEND_API_URL);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success || !result.data) {
          throw new Error('Invalid response from backend');
        }

        console.log(`✅ Successfully fetched ${result.count} bears from backend`);
        setBears(result.data);
      } catch (err) {
        console.error('Failed to load bear data:', err);
        setError('Failed to load bear information. Please refresh the page to try again.');
      } finally {
        setLoading(false);
      }
    };

    loadBearData();
  }, []);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    img.src = PLACEHOLDER_IMAGE;
    img.title = 'Image not available';
  };

  if (loading) {
    return <p>Loading bear information...</p>;
  }

  if (error) {
    return <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>;
  }

  if (bears.length === 0) {
    return <p>No bear information could be loaded.</p>;
  }

  return (
    <div>
      {bears.map((bear) => (
        <div
          key={bear.name}
          className="bear"
          style={{
            marginBottom: '20px',
            padding: '10px',
            border: '1px solid #ddd',
          }}
        >
          <img
            src={bear.image}
            alt={`Image of ${bear.name}`}
            onError={handleImageError}
            style={{
              width: '200px',
              height: 'auto',
              display: 'block',
              marginBottom: '10px',
            }}
          />
          <h4>{bear.name}</h4>
          <p>
            <em>Scientific name: </em>
            {bear.binomial}
          </p>
          <p>
            <em>Range: </em>
            {bear.range}
          </p>
        </div>
      ))}
      <p style={{ fontStyle: 'italic', marginTop: '20px' }}>
        Rendered {bears.length} bears successfully
      </p>
    </div>
  );
}

export default BearList;
