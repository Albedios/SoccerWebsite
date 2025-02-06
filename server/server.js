const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..'))); // Serve static files from project root

// Cache storage
let cache = {
    standings: { data: null, timestamp: 0 },
    matches: { data: null, timestamp: 0 },
    players: { data: null, timestamp: 0 }
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to check if cache is valid
const isCacheValid = (type) => {
    return cache[type].data && (Date.now() - cache[type].timestamp < CACHE_DURATION);
};

// Helper function to fetch data from Football API
async function fetchFromAPI(endpoint) {
    const maxRetries = 3;
    let retryCount = 0;
    
    while (retryCount < maxRetries) {
        try {
            const response = await fetch(`https://api.football-data.org/v4/${endpoint}`, {
                headers: {
                    'X-Auth-Token': process.env.FOOTBALL_API_KEY
                }
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                console.error('API Error Details:', {
                    status: response.status,
                    endpoint,
                    message: data.message || 'No error message provided',
                    errorCode: data.errorCode
                });
                
                // Check for specific error conditions
                if (response.status === 403) {
                    throw new Error('API key is invalid or expired');
                } else if (response.status === 429) {
                    throw new Error('API rate limit exceeded');
                } else if (response.status === 400) {
                    throw new Error(`Invalid request: ${data.message}`);
                }
                
                throw new Error(`API Error: ${response.status} - ${data.message || 'Unknown error'}`);
            }
            
            return data;
        } catch (error) {
            console.error(`Attempt ${retryCount + 1}/${maxRetries} failed:`, error.message);
            
            if (error.message.includes('rate limit') || retryCount === maxRetries - 1) {
                throw error;
            }
            
            // Exponential backoff
            const delay = Math.pow(2, retryCount) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
            retryCount++;
        }
    }
}

// Endpoints
app.get('/api/standings/:leagueId', async (req, res) => {
    try {
        const { leagueId } = req.params;
        
        if (isCacheValid('standings')) {
            return res.json(cache.standings.data);
        }

        const data = await fetchFromAPI(`competitions/${leagueId}/standings`);
        cache.standings = {
            data,
            timestamp: Date.now()
        };
        
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/matches/:leagueId', async (req, res) => {
    try {
        const { leagueId } = req.params;
        
        if (isCacheValid('matches')) {
            return res.json(cache.matches.data);
        }

        const data = await fetchFromAPI(`competitions/${leagueId}/matches`);
        cache.matches = {
            data,
            timestamp: Date.now()
        };
        
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/players/:teamId', async (req, res) => {
    try {
        const { teamId } = req.params;
        
        if (isCacheValid('players')) {
            return res.json(cache.players.data);
        }

        const data = await fetchFromAPI(`teams/${teamId}`);
        cache.players = {
            data,
            timestamp: Date.now()
        };
        
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error Details:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });

    // Handle specific error types
    if (err.message.includes('API key')) {
        return res.status(403).json({
            error: 'API Authentication Error',
            message: 'Please check your API key configuration'
        });
    }
    
    if (err.message.includes('rate limit')) {
        return res.status(429).json({
            error: 'Rate Limit Exceeded',
            message: 'Please try again later'
        });
    }

    // Generic error response
    res.status(500).json({
        error: 'Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
