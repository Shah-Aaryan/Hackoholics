import express from "express";
import axios from "axios";
const router = express.Router();

// POST /recommend
router.post("/recommend", async (req, res) => {
  try {
    const profile = req.body;
    const response = await axios.post("http://localhost:5000/recommend", profile);
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Recommendation failed" });
  }
});

// GET /insights
router.get("/insights", async (req, res) => {
  try {
    const household_id = req.query.household_id;
    const response = await axios.get(`http://localhost:5000/insights?household_id=${household_id}`);
    res.json({ insights: response.data.insights });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Insights fetch failed" });
  }
});

// GET /community-stats
router.get("/community-stats", async (req, res) => {
  try {
    // For demo, hardcoded
    res.json({ households: 120, energy_saved_kwh: 1250 });
  } catch (err) {
    res.status(500).json({ error: "Community stats failed" });
  }
});

export default router;
