import React, { useState, useEffect } from "react";

interface Recommendation {
  User: string;
  "Recommended Item 1": string;
  "Recommended Item 2": string;
  "Recommended Item 3": string;
  "Recommended Item 4": string;
  "Recommended Item 5": string;
}

const AzureStuff: React.FC = () => {
  const [personId, setPersonId] = useState<string>("");
  const [contentId, setContentId] = useState<string>("");
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set default personId and contentId when the component mounts
  useEffect(() => {
    setPersonId("-1130272294246983140");
    setContentId("310515487419366995");
  }, []);

  const callAzureEndpoint = async () => {
    if (!personId || !contentId) {
      setError("Please enter both Person ID and Content ID");
      return;
    }

    const requestBody = {
      Inputs: {
        input1: [
          {
            personId: Number(personId),
            contentId: Number(contentId),
          },
        ],
      },
      GlobalParameters: {},
    };

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setError(`Error ${response.status}: ${errorText}`);
        return;
      }

      const result = await response.json();
      const output = result?.Results?.output1;
      setRecommendations(output || []);
    } catch (err) {
      setError("Network or fetch error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Get Recommendations</h2>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Person ID"
          value={personId}
          onChange={(e) => setPersonId(e.target.value)}
          style={{ marginRight: "0.5rem" }}
        />
        <input
          type="text"
          placeholder="Content ID"
          value={contentId}
          onChange={(e) => setContentId(e.target.value)}
        />
      </div>

      <button onClick={callAzureEndpoint} disabled={loading}>
        {loading ? "Loading..." : "Fetch Recommendation"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {recommendations.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          {recommendations.map((rec, index) => (
            <div key={index} style={{ marginBottom: "1rem" }}>
              <strong>User:</strong> {rec.User}
              <ul>
                <li>{rec["Recommended Item 1"]}</li>
                <li>{rec["Recommended Item 2"]}</li>
                <li>{rec["Recommended Item 3"]}</li>
                <li>{rec["Recommended Item 4"]}</li>
                <li>{rec["Recommended Item 5"]}</li>
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AzureStuff;
