// routes/api.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

const ERGAST_API_URL = "https://api.jolpi.ca/ergast/api/f1";

// Route to get driver standings for a specific year
router.get('/standings/:year', async (req, res) => {
    const { year } = req.params;
    try {
        const url = `${ERGAST_API_URL}/${year}/driverStandings.json`;
        const response = await axios.get(url);
        
        if (response.data.MRData.StandingsTable.StandingsLists.length > 0) {
            const standings = response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
            res.json(standings);
        } else {
            res.json([]); // Return empty array if no standings found for that year
        }
    } catch (error) {
        console.error(`Error fetching standings for year ${year}:`, error.message);
        res.status(500).json({ message: "Failed to fetch driver standings" });
    }
});
router.get('/seasons', async (req, res) => {
    try {
        const url = `${ERGAST_API_URL}/seasons.json?limit=100`;
        const response = await axios.get(url);
        const seasons = response.data.MRData.SeasonTable.Seasons.map(s => s.season).reverse();
        res.json(seasons);
    } catch (error) {
        console.error("Error fetching seasons:", error.message);
        res.status(500).json({ message: "Failed to fetch seasons" });
    }
});
module.exports = router;