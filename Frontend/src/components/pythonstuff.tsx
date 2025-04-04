import React, { useState } from "react";
import "./styles.css";

const NewsRecommender: React.FC = () => {
  const [inputId, setInputId] = useState("");
  const [collabResults, setCollabResults] = useState<string[]>([]);
  const [contentResults, setContentResults] = useState<string[]>([]);
  const [azureResults, setAzureResults] = useState<string[]>([]);

  const getRecommendations = async () => {
    try {
      const responses = await Promise.all([
        fetch(`/collab_recommend?id=${inputId}`),
        fetch(`/content_recommend?id=${inputId}`),
        fetch(`/azure_recommend?id=${inputId}`),
      ]);

      const [collabData, contentData, azureData] = await Promise.all(
        responses.map((res) => res.json())
      );

      setCollabResults(collabData.recommendations);
      setContentResults(contentData.recommendations);
      setAzureResults(azureData.recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  return (
    <div className="app-container">
      <h1>News Article Recommender</h1>

      <label htmlFor="userInput">Enter User ID or Item ID:</label>
      <br />
      <input
        type="text"
        id="userInput"
        placeholder="e.g. 123456789"
        value={inputId}
        onChange={(e) => setInputId(e.target.value)}
      />
      <br />
      <button onClick={getRecommendations}>Get Recommendations</button>

      <div className="results">
        <div className="recommendation-list" id="collab">
          <h2>Collaborative Filtering</h2>
          <ul>
            {collabResults.map((item, index) => (
              <li key={`collab-${index}`}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="recommendation-list" id="content">
          <h2>Content-Based Filtering</h2>
          <ul>
            {contentResults.map((item, index) => (
              <li key={`content-${index}`}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="recommendation-list" id="azure">
          <h2>Azure ML Recommender</h2>
          <ul>
            {azureResults.map((item, index) => (
              <li key={`azure-${index}`}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NewsRecommender;
