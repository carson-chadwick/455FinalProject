import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import "./styles.css";

const NewsRecommender: React.FC = () => {
  const [inputId, setInputId] = useState("");
  const [collabResults, setCollabResults] = useState<string[]>([]);
  const [contentResults, setContentResults] = useState<string[]>([]);
  const [azureResults, setAzureResults] = useState<string[]>([]);
  const [contentIds, setContentIds] = useState<string[]>([]);

  useEffect(() => {
    // Fetch and parse the CSV to populate content IDs
    const fetchContentIds = async () => {
      try {
        const response = await fetch("/collaborativeRecommendations.csv");
        const csvText = await response.text();

        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            const rows = results.data;
            const ids = rows.map((row) => row.contentId).filter(Boolean); // Extract content IDs
            setContentIds([...new Set(ids)]); // Remove duplicates
          },
          error: (error) => {
            console.error("Error parsing CSV file:", error);
          },
        });
      } catch (error) {
        console.error("Error fetching CSV file:", error);
      }
    };

    fetchContentIds();
  }, []);

  const getCollaborativeRecommendations = async () => {
    try {
      // Fetch and parse the CSV file for recommendations
      const response = await fetch("/collaborativeRecommendations.csv");
      const csvText = await response.text();

      Papa.parse(csvText, {
        header: true,
        complete: (results) => {
          const rows = results.data;
          const row = rows.find((r) => r.contentId === inputId);

          if (row) {
            setCollabResults([
              row.recommendationTitle1,
              row.recommendationTitle2,
              row.recommendationTitle3,
              row.recommendationTitle4,
              row.recommendationTitle5,
            ]);
          } else {
            setCollabResults([]); // Clear results if no match
            console.error(
              "No collaborative recommendations found for the given ID."
            );
          }
        },
        error: (error) => {
          console.error("Error parsing CSV file:", error);
        },
      });
    } catch (error) {
      console.error("Error fetching CSV file:", error);
    }
  };

  const getContentRecommendations = async () => {
    try {
      const response = await fetch("/ContentFiltering.csv");
      const csvText = await response.text();

      Papa.parse(csvText, {
        header: true,
        complete: (results) => {
          const rows = results.data;
          const row = rows.find((r) => r.contentId === inputId);

          if (row) {
            setContentResults([
              row.recommendationTitle1,
              row.recommendationTitle2,
              row.recommendationTitle3,
              row.recommendationTitle4,
              row.recommendationTitle5,
            ]);
          } else {
            setContentResults([]);
            console.error(
              "No content-based recommendations found for this ID."
            );
          }
        },
        error: (error) => {
          console.error("Error parsing ContentFiltering.csv:", error);
        },
      });
    } catch (error) {
      console.error("Error fetching ContentFiltering.csv:", error);
    }
  };

  const getRecommendations = async () => {
    await Promise.all([
      getCollaborativeRecommendations(),
      getContentRecommendations(),
      getAzureRecommendations(),
    ]);
  };

  return (
    <div className="app-container">
      <h1>News Article Recommender</h1>

      <label htmlFor="userInput">Select User ID or Item ID:</label>
      <br />
      <select
        id="userInput"
        value={inputId}
        onChange={(e) => setInputId(e.target.value)}
      >
        <option value="">Select an ID</option>
        {contentIds.map((id, index) => (
          <option key={`contentId-${index}`} value={id}>
            {id}
          </option>
        ))}
      </select>
      <br />
      <button onClick={getRecommendations} disabled={!inputId}>
        Get Recommendations
      </button>

      <div className="results">
        {/* Collaborative Filtering Results */}
        <div className="recommendation-list" id="collab">
          <h2>Collaborative Filtering</h2>
          <ul>
            {collabResults.length > 0 ? (
              collabResults.map((item, index) => (
                <li key={`collab-${index}`}>{item}</li>
              ))
            ) : (
              <li>No collaborative recommendations found.</li>
            )}
          </ul>
        </div>

        {/* Content-Based Filtering Results */}
        <div className="recommendation-list" id="content">
          <h2>Content-Based Filtering</h2>
          <ul>
            {contentResults.length > 0 ? (
              contentResults.map((item, index) => (
                <li key={`content-${index}`}>{item}</li>
              ))
            ) : (
              <li>No content-based recommendations available.</li>
            )}
          </ul>
        </div>

        {/* Azure ML Results */}
        <div className="recommendation-list" id="azure">
          <h2>Azure ML Recommender</h2>
          <ul>
            {azureResults.length > 0 ? (
              azureResults.map((item, index) => (
                <li key={`azure-${index}`}>{item}</li>
              ))
            ) : (
              <li>No Azure recommendations available.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NewsRecommender;

// import React, { useState } from "react";
// import Papa from "papaparse";
// import "./styles.css";

// const NewsRecommender: React.FC = () => {
//   const [inputId, setInputId] = useState("");
//   const [collabResults, setCollabResults] = useState<string[]>([]);
//   const [contentResults, setContentResults] = useState<string[]>([]);
//   const [azureResults, setAzureResults] = useState<string[]>([]);

//   const getCollaborativeRecommendations = async () => {
//     try {
//       // Fetch and parse the CSV file
//       const response = await fetch("/collaborativeRecommendations.csv");
//       const csvText = await response.text();

//       Papa.parse(csvText, {
//         header: true,
//         complete: (results: { data: any; }) => {
//           const rows = results.data;
//           const row = rows.find((r: { contentId: string; }) => r.contentId === inputId);

//           // Extract recommendations if the row exists
//           if (row) {
//             setCollabResults([
//               row.recommendationTitle1,
//               row.recommendationTitle2,
//               row.recommendationTitle3,
//               row.recommendationTitle4,
//               row.recommendationTitle5,
//             ]);
//           } else {
//             setCollabResults([]); // Clear if no match
//             console.error("No collaborative recommendations found for the given ID.");
//           }
//         },
//         error: (error: any) => {
//           console.error("Error parsing CSV file:", error);
//         },
//       });
//     } catch (error) {
//       console.error("Error fetching CSV file:", error);
//     }
//   };

//   const getContentRecommendations = async () => {
//     try {
//       const response = await fetch(`/content_recommend?id=${inputId}`);
//       const data = await response.json();
//       setContentResults(data.recommendations || []);
//     } catch (error) {
//       console.error("Error fetching content-based recommendations:", error);
//     }
//   };

//   const getAzureRecommendations = async () => {
//     try {
//       const response = await fetch(`/azure_recommend?id=${inputId}`);
//       const data = await response.json();
//       setAzureResults(data.recommendations || []);
//     } catch (error) {
//       console.error("Error fetching Azure recommendations:", error);
//     }
//   };

//   const getRecommendations = async () => {
//     await Promise.all([
//       getCollaborativeRecommendations(),
//       getContentRecommendations(),
//       getAzureRecommendations(),
//     ]);
//   };

//   return (
//     <div className="app-container">
//       <h1>News Article Recommender</h1>

//       <label htmlFor="userInput">Enter User ID or Item ID:</label>
//       <br />
//       <input
//         type="text"
//         id="userInput"
//         placeholder="e.g. 123456789"
//         value={inputId}
//         onChange={(e) => setInputId(e.target.value)}
//       />
//       <br />
//       <button onClick={getRecommendations}>Get Recommendations</button>

//       <div className="results">
//         {/* Collaborative Filtering Results */}
//         <div className="recommendation-list" id="collab">
//           <h2>Collaborative Filtering</h2>
//           <ul>
//             {collabResults.length > 0 ? (
//               collabResults.map((item, index) => (
//                 <li key={`collab-${index}`}>{item}</li>
//               ))
//             ) : (
//               <li>No collaborative recommendations found.</li>
//             )}
//           </ul>
//         </div>

//         {/* Content-Based Filtering Results */}
//         <div className="recommendation-list" id="content">
//           <h2>Content-Based Filtering</h2>
//           <ul>
//             {contentResults.length > 0 ? (
//               contentResults.map((item, index) => (
//                 <li key={`content-${index}`}>{item}</li>
//               ))
//             ) : (
//               <li>No content-based recommendations available.</li>
//             )}
//           </ul>
//         </div>

//         {/* Azure ML Results */}
//         <div className="recommendation-list" id="azure">
//           <h2>Azure ML Recommender</h2>
//           <ul>
//             {azureResults.length > 0 ? (
//               azureResults.map((item, index) => (
//                 <li key={`azure-${index}`}>{item}</li>
//               ))
//             ) : (
//               <li>No Azure recommendations available.</li>
//             )}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NewsRecommender;
