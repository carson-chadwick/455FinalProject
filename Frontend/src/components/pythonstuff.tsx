import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import "./styles.css";

const NewsRecommender: React.FC = () => {
  const [inputId, setInputId] = useState("");
  const [collabResults, setCollabResults] = useState<string[]>([]);
  const [contentResults, setContentResults] = useState<string[]>([]);
  const [collabData, setCollabData] = useState<Record<string, string[]>>({});
  const [contentData, setContentData] = useState<Record<string, string[]>>({});

  useEffect(() => {
    // Load collaborative filtering CSV
    Papa.parse("/collaborativeRecommendation.csv", {
      download: true,
      header: true,
      complete: (result) => {
        const data: Record<string, string[]> = {};
        result.data.forEach((row: any) => {
          const contentId = String(row.contentId).trim();
          const recommendations = Object.values(row).slice(1);
          data[contentId] = recommendations;
        });
        setCollabData(data);
        console.log(
          "Loaded collaborative data:",
          Object.keys(data).slice(0, 5)
        );
      },
    });

    // Load content-based filtering CSV
    Papa.parse("/ContentFiltering.csv", {
      download: true,
      header: true,
      complete: (result) => {
        const data: Record<string, string[]> = {};
        result.data.forEach((row: any) => {
          const contentId = String(row.contentId).trim();
          const recommendations = Object.values(row).slice(1);
          data[contentId] = recommendations;
        });
        setContentData(data);
        console.log("Loaded content data:", Object.keys(data).slice(0, 5));
      },
    });
  }, []);

  const getRecommendations = () => {
    const id = inputId.trim();
    setCollabResults(collabData[id] || ["No results found"]);
    setContentResults(contentData[id] || ["No results found"]);
  };

  return (
    <div className="app-container">
      <h1>Hello World</h1>
      <h2>News Article Recommender</h2>

      <label htmlFor="userInput">Enter Article ID:</label>
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
      </div>
    </div>
  );
};

export default NewsRecommender;
