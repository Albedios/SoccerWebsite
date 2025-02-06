const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(path.join(__dirname)));

// Basic routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/teams', (req, res) => {
    res.sendFile(path.join(__dirname, 'teams.html'));
});

app.get('/matches', (req, res) => {
    res.sendFile(path.join(__dirname, 'matches.html'));
});

app.get('/statistics', (req, res) => {
    res.sendFile(path.join(__dirname, 'statistics.html'));
});

app.get('/leagues', (req, res) => {
    res.sendFile(path.join(__dirname, 'leagues.html'));
});

// Mock API endpoints
app.get('/api/standings/PL', (req, res) => {
    res.json({
        standings: [{
            table: [
                {
                    position: 1,
                    team: { name: 'Manchester City' },
                    playedGames: 27,
                    won: 19,
                    draw: 6,
                    lost: 2,
                    points: 63
                },
                // Add more teams as needed
            ]
        }]
    });
});

app.get('/api/matches', (req, res) => {
    res.json({
        upcoming: [
            {
                id: 'match-1',
                homeTeam: {
                    name: 'Manchester City',
                    logo: 'https://crests.football-data.org/65.svg'
                },
                awayTeam: {
                    name: 'Liverpool',
                    logo: 'https://crests.football-data.org/64.svg'
                },
                date: '2025-02-10T20:00:00',
                venue: 'Etihad Stadium',
                competition: 'Premier League',
                status: 'SCHEDULED'
            }
        ],
        live: [],
        past: []
    });
});

// Leagues API endpoint
app.get('/api/leagues', (req, res) => {
    const data = {
        featured: {
            name: 'Premier League',
            country: 'England',
            banner: 'https://via.placeholder.com/1200x300',
            logo: 'https://crests.football-data.org/PL.png'
        },
        stats: {
            teams: 98,
            matches: 1376,
            goals: 3921,
            players: 2450
        }
    };
    res.json(data);
});

// Players API endpoint
app.get('/api/players', (req, res) => {
    const players = [
        {
            id: 1,
            name: 'Erling Haaland',
            team: 'Manchester City',
            position: 'Forward',
            age: 23,
            games: 27,
            goals: 28,
            assists: 5,
            cleanSheets: 0,
            yellowCards: 2,
            redCards: 0,
            image: 'https://via.placeholder.com/50'
        },
        {
            id: 2,
            name: 'Mohamed Salah',
            team: 'Liverpool',
            position: 'Forward',
            age: 31,
            games: 25,
            goals: 22,
            assists: 15,
            cleanSheets: 0,
            yellowCards: 1,
            redCards: 0,
            image: 'https://via.placeholder.com/50'
        },
        {
            id: 3,
            name: 'Kevin De Bruyne',
            team: 'Manchester City',
            position: 'Midfielder',
            age: 32,
            games: 23,
            goals: 8,
            assists: 14,
            cleanSheets: 0,
            yellowCards: 3,
            redCards: 0,
            image: 'https://via.placeholder.com/50'
        },
        {
            id: 4,
            name: 'Ederson',
            team: 'Manchester City',
            position: 'Goalkeeper',
            age: 30,
            games: 27,
            goals: 0,
            assists: 1,
            cleanSheets: 12,
            yellowCards: 1,
            redCards: 0,
            image: 'https://via.placeholder.com/50'
        },
        {
            id: 5,
            name: 'Bruno Fernandes',
            team: 'Manchester United',
            position: 'Midfielder',
            age: 29,
            games: 26,
            goals: 7,
            assists: 8,
            cleanSheets: 0,
            yellowCards: 4,
            redCards: 0,
            image: 'https://via.placeholder.com/50'
        },
        {
            id: 6,
            name: 'Bukayo Saka',
            team: 'Arsenal',
            position: 'Forward',
            age: 22,
            games: 27,
            goals: 13,
            assists: 12,
            cleanSheets: 0,
            yellowCards: 2,
            redCards: 0,
            image: 'https://via.placeholder.com/50'
        }
    ];

    // Support filtering and sorting
    let filteredPlayers = [...players];
    
    // Apply filters from query params if present
    const { team, position, sort } = req.query;
    
    if (team) {
        filteredPlayers = filteredPlayers.filter(p => p.team === team);
    }
    
    if (position) {
        filteredPlayers = filteredPlayers.filter(p => p.position === position);
    }
    
    // Sort by specified stat
    if (sort) {
        filteredPlayers.sort((a, b) => b[sort] - a[sort]);
    }

    res.json(filteredPlayers);
});

// Statistics API endpoints
app.get('/api/statistics/:season', (req, res) => {
    const season = req.params.season;
    const stats = {
        overview: {
            totalGoals: 1064,
            goalsPerMatch: 2.8,
            cleanSheets: 98,
            cleanSheetPercentage: 25.8,
            totalCards: 842,
            cardsPerMatch: 2.2,
            averageAttendance: 39542,
            attendancePercentage: 89
        },
        goalsByTime: {
            '0-15': 125,
            '16-30': 142,
            '31-45': 156,
            '45+': 22,
            '46-60': 138,
            '61-75': 168,
            '76-90': 178,
            '90+': 35
        },
        teamPerformance: {
            'Manchester City': {
                progression: [3, 13, 25, 34, 46, 55, 63],
                color: '#98C3E7'
            },
            'Liverpool': {
                progression: [3, 15, 28, 37, 43, 52, 61],
                color: '#E31B23'
            },
            'Arsenal': {
                progression: [3, 12, 24, 35, 44, 50, 58],
                color: '#EF0107'
            }
        },
        records: {
            goals: {
                player: 'Erling Haaland',
                value: 36,
                season: '2022/23',
                image: 'https://via.placeholder.com/50'
            },
            assists: {
                player: 'Kevin De Bruyne',
                value: 20,
                season: '2019/20',
                image: 'https://via.placeholder.com/50'
            }
        },
        historical: [
            {
                season: '2022/23',
                champion: 'Manchester City',
                topScorer: 'Erling Haaland (36)',
                mostAssists: 'Kevin De Bruyne (16)',
                goals: 1084,
                cards: 1056
            },
            {
                season: '2021/22',
                champion: 'Manchester City',
                topScorer: 'Son Heung-min (23)',
                mostAssists: 'Mohamed Salah (13)',
                goals: 1072,
                cards: 1038
            },
            {
                season: '2020/21',
                champion: 'Manchester City',
                topScorer: 'Harry Kane (23)',
                mostAssists: 'Harry Kane (14)',
                goals: 1024,
                cards: 1097
            }
        ]
    };
    res.json(stats);
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
