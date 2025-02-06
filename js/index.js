document.addEventListener('DOMContentLoaded', () => {
    // Dashboard data
    const TOP_SCORERS = [
        {
            rank: 1,
            player: 'Erling Haaland',
            team: 'Manchester City',
            goals: 28,
            image: 'https://via.placeholder.com/50'
        },
        {
            rank: 2,
            player: 'Harry Kane',
            team: 'Bayern Munich',
            goals: 25,
            image: 'https://via.placeholder.com/50'
        },
        {
            rank: 3,
            player: 'Mohamed Salah',
            team: 'Liverpool',
            goals: 22,
            image: 'https://via.placeholder.com/50'
        }
    ];

    const TOP_TEAMS = [
        {
            position: 1,
            name: 'Manchester City',
            logo: 'https://crests.football-data.org/65.svg',
            points: 63,
            played: 27
        },
        {
            position: 2,
            name: 'Liverpool',
            logo: 'https://crests.football-data.org/64.svg',
            points: 61,
            played: 27
        },
        {
            position: 3,
            name: 'Arsenal',
            logo: 'https://crests.football-data.org/57.svg',
            points: 58,
            played: 27
        },
        {
            position: 4,
            name: 'Aston Villa',
            logo: 'https://crests.football-data.org/58.svg',
            points: 55,
            played: 27
        }
    ];

    // Populate team standings
    function renderTeamStandings() {
        const standingsContainer = document.querySelector('.team-standings');
        standingsContainer.innerHTML = TOP_TEAMS.map(team => `
            <div class="standing-row">
                <span class="team-position">${team.position}</span>
                <div class="team-info">
                    <div class="team-logo">
                        <img src="${team.logo}" alt="${team.name} logo" loading="lazy">
                    </div>
                    <span class="team-name">${team.name}</span>
                </div>
                <span class="team-points">${team.points} pts</span>
            </div>
        `).join('');
    }

    // Populate top scorers
    function renderTopScorers() {
        const scorersContainer = document.querySelector('.scorers-list');
        scorersContainer.innerHTML = TOP_SCORERS.map(scorer => `
            <div class="scorer-row">
                <div class="scorer-rank">${scorer.rank}</div>
                <div class="scorer-info">
                    <div class="scorer-name">${scorer.player}</div>
                    <div class="scorer-team">${scorer.team}</div>
                </div>
                <div class="scorer-goals">
                    <i class="fas fa-futbol"></i>
                    ${scorer.goals}
                </div>
            </div>
        `).join('');
    }

    // Fetch and render next fixtures
    async function fetchNextFixtures() {
        try {
            // This would be replaced with actual API call
            const matches = [
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
                    competition: 'Premier League'
                }
            ];

            const matchesContainer = document.querySelector('.matches-list');
            matchesContainer.innerHTML = matches.map(match => `
                <div class="match-preview">
                    <div class="match-teams">
                        <div class="team">
                            <div class="team-logo">
                                <img src="${match.homeTeam.logo}" alt="${match.homeTeam.name}" loading="lazy">
                            </div>
                            <span class="team-name">${match.homeTeam.name}</span>
                        </div>
                        <div class="match-time">
                            <div class="date">${new Date(match.date).toLocaleDateString()}</div>
                            <div class="time">${new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                        <div class="team">
                            <div class="team-logo">
                                <img src="${match.awayTeam.logo}" alt="${match.awayTeam.name}" loading="lazy">
                            </div>
                            <span class="team-name">${match.awayTeam.name}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Failed to fetch fixtures:', error);
        }
    }

    // Fetch and render latest news
    async function fetchLatestNews() {
        try {
            // This would be replaced with actual API call
            const news = [
                {
                    title: 'Premier League Title Race Heats Up',
                    summary: 'Top teams battle for supremacy as the season enters its crucial phase...',
                    image: 'https://via.placeholder.com/400x200',
                    timestamp: '2 hours ago'
                },
                {
                    title: 'Record Breaking Transfer Window',
                    summary: 'Premier League clubs set new spending records in January transfer window...',
                    image: 'https://via.placeholder.com/400x200',
                    timestamp: '5 hours ago'
                }
            ];

            const newsGrid = document.querySelector('.news-grid');
            newsGrid.innerHTML = news.map(item => `
                <article class="news-card">
                    <div class="news-image">
                        <img src="${item.image}" alt="${item.title}" loading="lazy">
                    </div>
                    <div class="news-content">
                        <h3>${item.title}</h3>
                        <p>${item.summary}</p>
                        <div class="news-meta">
                            <span><i class="far fa-clock"></i> ${item.timestamp}</span>
                            <a href="#" class="read-more">Read More</a>
                        </div>
                    </div>
                </article>
            `).join('');
        } catch (error) {
            console.error('Failed to fetch news:', error);
        }
    }

    // Initialize dashboard
    function initializeDashboard() {
        renderTeamStandings();
        renderTopScorers();
        fetchNextFixtures();
        fetchLatestNews();
    }

    // Auto-refresh data every 5 minutes
    initializeDashboard();
    setInterval(initializeDashboard, 300000);
});
