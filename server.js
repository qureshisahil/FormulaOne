// server.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = 3000;

const apiRoutes = require('./routes/api');

// --- Middleware & Configuration ---
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// --- Routes ---
app.use('/api', apiRoutes);

// Updated main page route to be dynamic
app.get('/:year?', async (req, res) => {
    try {
        // Fetch the list of all available seasons
        const seasonsResponse = await axios.get(`http://localhost:${PORT}/api/seasons`);
        const seasons = seasonsResponse.data;

        // Determine the year to display
        // If a year is provided in the URL, use it. Otherwise, default to the latest season available.
        const yearToFetch = req.params.year || seasons[0];

        // Fetch the standings for the determined year
        const standingsResponse = await axios.get(`http://localhost:${PORT}/api/standings/${yearToFetch}`);
        
        res.render('standings', {
            standings: standingsResponse.data,
            year: yearToFetch,
        //  Pass the full list of seasons to the view for the dropdown
            seasons: seasons,
            page: `${yearToFetch} Standings`
        });

    } catch (error) {
        console.error("Error rendering page:", error.message);
        res.status(500).send("<h1>Error</h1><p>Could not load F1 data.</p>");
    }
});

// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`✅ Server is running beautifully at http://localhost:${PORT}`);
});