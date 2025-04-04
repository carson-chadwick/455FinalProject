const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // ✅ Now works with v2

const app = express();
const PORT = 5000;

const AZURE_ENDPOINT =
  "http://fef9d82f-42bc-4c0f-bb90-5723682db315.eastus2.azurecontainer.io/score";
const API_KEY = "ER6vrjSN9cD90QQOOZOSBiGq1EuoD92a";

app.use(cors());
app.use(express.json());

app.post("/proxy", async (req, res) => {
  try {
    const response = await fetch(AZURE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Azure request failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Proxy server is alive!");
});
