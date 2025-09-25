// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Import our new data logic functions
const { fetchDriverStandings, fetchSeasons } = require('./data-logic');
const apiRoutes = require('./routes/api');

// --- Middleware & Configuration ---
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// --- Routes ---
app.use('/api', apiRoutes);

// Updated main page route to be more robust
app.get('/:year?', async (req, res) => {
    try {
        const seasons = await fetchSeasons();
        if (!seasons) throw new Error("Could not fetch seasons list.");

        const yearToFetch = req.params.year || seasons[0];
        
        const standings = await fetchDriverStandings(yearToFetch);
        if (standings === null) throw new Error(`Could not fetch standings for ${yearToFetch}.`);

        res.render('standings', {
            standings: standings,
            year: yearToFetch,
            seasons: seasons,
            page: `${yearToFetch} Standings`
        });

    } catch (error) {
        console.error("FATAL ERROR rendering page:", error.message);
        res.status(500).send(`<h1>Oops! Something went wrong.</h1><p>${error.message}</p>`);
    }
});

// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`✅ Server is running beautifully at http://localhost:${PORT}`);
});