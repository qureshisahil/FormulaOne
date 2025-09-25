// data-logic.js
const axios = require('axios');
const ERGAST_API_URL = "https://api.jolpi.ca/ergast/api/f1";

async function fetchDriverStandings(year) {
    try {
        const url = `${ERGAST_API_URL}/${year}/driverStandings.json`;
        const response = await axios.get(url);
        
        if (response.data?.MRData?.StandingsTable?.StandingsLists?.length > 0) {
            return response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
        }
        return []; // Return empty array if no data
    } catch (error) {
        console.error(`Error fetching standings for year ${year}:`, error.message);
        return null; // Return null on error
    }
}

async function fetchSeasons() {
    try {
        const url = `${ERGAST_API_URL}/seasons.json?limit=100`;
        const response = await axios.get(url);

        if (response.data?.MRData?.SeasonTable?.Seasons) {
            return response.data.MRData.SeasonTable.Seasons.map(s => s.season).reverse();
        }
        return [];
    } catch (error) {
        console.error("Error fetching seasons:", error.message);
        return null;
    }
}

module.exports = {
    fetchDriverStandings,
    fetchSeasons
};