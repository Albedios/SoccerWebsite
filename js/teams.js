document.addEventListener('DOMContentLoaded', () => {
    const TEAMS_DATA = {
        'manchester-city': {
            name: 'Manchester City',
            logo: 'https://crests.football-data.org/65.svg',
            founded: 1894,
            venue: 'Etihad Stadium',
            colors: ['Sky Blue', 'White'],
            description: 'Manchester City Football Club is an English football club based in Manchester that competes in the Premier League.',
            squad: [], // Will be populated from API
            stats: {
                position: 1,
                played: 27,
                won: 19,
                drawn: 6,
                lost: 2,
                points: 63
            }
        },
        'liverpool': {
            name: 'Liverpool',
            logo: 'https://crests.football-data.org/64.svg',
            founded: 1892,
            venue: 'Anfield',
            colors: ['Red', 'White'],
            description: 'Liverpool Football Club is a professional football club based in Liverpool, England.',
            squad: [],
            stats: {
                position: 2,
                played: 27,
                won: 18,
                drawn: 7,
                lost: 2,
                points: 61
            }
        },
        'arsenal': {
            name: 'Arsenal',
            logo: 'https://crests.football-data.org/57.svg',
            founded: 1886,
            venue: 'Emirates Stadium',
            colors: ['Red', 'White'],
            description: 'Arsenal Football Club is a professional football club based in Islington, London.',
            squad: [],
            stats: {
                position: 3,
                played: 27,
                won: 17,
                drawn: 7,
                lost: 3,
                points: 58
            }
        },
        'aston-villa': {
            name: 'Aston Villa',
            logo: 'https://crests.football-data.org/58.svg',
            founded: 1874,
            venue: 'Villa Park',
            colors: ['Claret', 'Blue'],
            description: 'Aston Villa Football Club is a professional football club based in Birmingham, England.',
            squad: [],
            stats: {
                position: 4,
                played: 27,
                won: 16,
                drawn: 7,
                lost: 4,
                points: 55
            }
        },
        'tottenham': {
            name: 'Tottenham Hotspur',
            logo: 'https://crests.football-data.org/73.svg',
            founded: 1882,
            venue: 'Tottenham Hotspur Stadium',
            colors: ['White', 'Navy Blue'],
            description: 'Tottenham Hotspur Football Club, commonly known as Spurs, is a professional football club based in Tottenham, London.',
            squad: [],
            stats: {
                position: 5,
                played: 27,
                won: 15,
                drawn: 6,
                lost: 6,
                points: 51
            }
        },
        'manchester-united': {
            name: 'Manchester United',
            logo: 'https://crests.football-data.org/66.svg',
            founded: 1878,
            venue: 'Old Trafford',
            colors: ['Red', 'Black'],
            description: 'Manchester United Football Club is a professional football club based in Old Trafford, Greater Manchester, England.',
            squad: [],
            stats: {
                position: 6,
                played: 27,
                won: 14,
                drawn: 6,
                lost: 7,
                points: 48
            }
        },
        // Add more teams as needed
    };

    const teamsGrid = document.querySelector('.teams-grid');
    const teamDetails = document.querySelector('.team-details');
    const searchInput = document.getElementById('team-search');
    let currentTeams = TEAMS_DATA;

    function createTeamCard(teamId, team) {
        return `
            <div class="team-card" data-team-id="${teamId}">
                <div class="team-logo">
                    <img src="${team.logo}" alt="${team.name} logo" loading="lazy">
                </div>
                <div class="team-info">
                    <h3>${team.name}</h3>
                    <p class="team-venue"><i class="fas fa-stadium"></i> ${team.venue}</p>
                    <div class="team-stats">
                        <span title="Position"><i class="fas fa-hashtag"></i> ${team.stats.position}</span>
                        <span title="Points"><i class="fas fa-star"></i> ${team.stats.points}</span>
                    </div>
                </div>
                <button class="details-btn" onclick="showTeamDetails('${teamId}')">
                    View Details <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        `;
    }

    function showTeamDetails(teamId) {
        const team = TEAMS_DATA[teamId];
        if (!team) return;

        const content = `
            <div class="team-header">
                <div class="team-logo">
                    <img src="${team.logo}" alt="${team.name} logo">
                </div>
                <div class="team-info">
                    <h2>${team.name}</h2>
                    <p class="team-meta">
                        <span><i class="fas fa-calendar"></i> Founded: ${team.founded}</span>
                        <span><i class="fas fa-stadium"></i> Venue: ${team.venue}</span>
                    </p>
                    <p class="team-colors">
                        <i class="fas fa-palette"></i> Colors: ${team.colors.join(', ')}
                    </p>
                </div>
            </div>
            <div class="team-description">
                <p>${team.description}</p>
            </div>
            <div class="team-statistics">
                <h3><i class="fas fa-chart-bar"></i> Season Statistics</h3>
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-label">Position</span>
                        <span class="stat-value">${team.stats.position}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Played</span>
                        <span class="stat-value">${team.stats.played}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Won</span>
                        <span class="stat-value">${team.stats.won}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Drawn</span>
                        <span class="stat-value">${team.stats.drawn}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Lost</span>
                        <span class="stat-value">${team.stats.lost}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Points</span>
                        <span class="stat-value">${team.stats.points}</span>
                    </div>
                </div>
            </div>
        `;

        document.querySelector('.team-details-content').innerHTML = content;
        document.querySelector('.teams-grid').classList.add('hidden');
        teamDetails.classList.remove('hidden');

        // Animate entrance
        requestAnimationFrame(() => {
            teamDetails.style.opacity = '1';
            teamDetails.style.transform = 'translateY(0)';
        });
    }

    window.closeTeamDetails = function() {
        teamDetails.style.opacity = '0';
        teamDetails.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            teamDetails.classList.add('hidden');
            document.querySelector('.teams-grid').classList.remove('hidden');
        }, 300);
    };

    function filterTeams(searchTerm) {
        const term = searchTerm.toLowerCase();
        currentTeams = Object.entries(TEAMS_DATA).reduce((acc, [id, team]) => {
            if (team.name.toLowerCase().includes(term) || 
                team.venue.toLowerCase().includes(term)) {
                acc[id] = team;
            }
            return acc;
        }, {});
        renderTeams();
    }

    function renderTeams() {
        teamsGrid.innerHTML = Object.entries(currentTeams)
            .map(([id, team]) => createTeamCard(id, team))
            .join('');

        // Animate cards entrance
        const cards = document.querySelectorAll('.team-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Initialize
    renderTeams();

    // Search functionality
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            filterTeams(e.target.value);
        }, 300);
    });

    // Fetch real-time data
    async function fetchTeamData() {
        try {
            const response = await fetch('http://localhost:3000/api/standings/PL');
            const data = await response.json();
            
            data.standings[0].table.forEach(teamData => {
                const teamId = teamData.team.name.toLowerCase().replace(/\s+/g, '-');
                if (TEAMS_DATA[teamId]) {
                    TEAMS_DATA[teamId].stats = {
                        position: teamData.position,
                        played: teamData.playedGames,
                        won: teamData.won,
                        drawn: teamData.draw,
                        lost: teamData.lost,
                        points: teamData.points
                    };
                }
            });
            
            renderTeams();
        } catch (error) {
            console.error('Failed to fetch team data:', error);
        }
    }

    // Initial fetch and setup auto-refresh
    fetchTeamData();
    setInterval(fetchTeamData, 300000); // Refresh every 5 minutes
});
