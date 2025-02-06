document.addEventListener('DOMContentLoaded', () => {
    const LEAGUES_DATA = {
        topLeagues: [
            {
                id: 'premier-league',
                name: 'Premier League',
                country: 'England',
                logo: 'https://crests.football-data.org/PL.png',
                teams: 20,
                matches: 380,
                goals: 1064,
                topScorer: 'Erling Haaland'
            },
            {
                id: 'la-liga',
                name: 'La Liga',
                country: 'Spain',
                logo: 'https://crests.football-data.org/PD.png',
                teams: 20,
                matches: 380,
                goals: 982,
                topScorer: 'Jude Bellingham'
            },
            {
                id: 'bundesliga',
                name: 'Bundesliga',
                country: 'Germany',
                logo: 'https://crests.football-data.org/BL1.png',
                teams: 18,
                matches: 306,
                goals: 892,
                topScorer: 'Harry Kane'
            }
        ],
        europeanCompetitions: [
            {
                id: 'champions-league',
                name: 'Champions League',
                country: 'Europe',
                logo: 'https://crests.football-data.org/CL.png',
                teams: 32,
                matches: 125,
                goals: 368,
                topScorer: 'Erling Haaland'
            },
            {
                id: 'europa-league',
                name: 'Europa League',
                country: 'Europe',
                logo: 'https://crests.football-data.org/EL.png',
                teams: 32,
                matches: 205,
                goals: 285,
                topScorer: 'Pierre-Emerick Aubameyang'
            }
        ],
        otherLeagues: [
            {
                id: 'serie-a',
                name: 'Serie A',
                country: 'Italy',
                logo: 'https://crests.football-data.org/SA.png',
                teams: 20,
                matches: 380,
                goals: 945,
                topScorer: 'Lautaro Martínez'
            },
            {
                id: 'ligue-1',
                name: 'Ligue 1',
                country: 'France',
                logo: 'https://crests.football-data.org/FL1.png',
                teams: 18,
                matches: 306,
                goals: 875,
                topScorer: 'Kylian Mbappé'
            }
        ]
    };

    // Initialize page
    renderLeagues();
    setupFilters();

    function createLeagueCard(league) {
        return `
            <div class="league-card" data-country="${league.country.toLowerCase()}">
                <div class="league-card-header">
                    <img src="${league.logo}" alt="${league.name} logo" class="league-card-logo">
                    <div class="league-card-info">
                        <h3>${league.name}</h3>
                        <p>${league.country}</p>
                    </div>
                </div>
                <div class="league-card-content">
                    <div class="league-card-stats">
                        <div class="league-card-stat">
                            <span>Teams</span>
                            <strong>${league.teams}</strong>
                        </div>
                        <div class="league-card-stat">
                            <span>Matches</span>
                            <strong>${league.matches}</strong>
                        </div>
                        <div class="league-card-stat">
                            <span>Goals</span>
                            <strong>${league.goals}</strong>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function renderLeagues(filterCountry = '') {
        // Render top leagues
        const topLeaguesContainer = document.getElementById('top-leagues');
        topLeaguesContainer.innerHTML = LEAGUES_DATA.topLeagues
            .filter(league => !filterCountry || league.country.toLowerCase() === filterCountry)
            .map(createLeagueCard)
            .join('');

        // Render European competitions
        const europeanContainer = document.getElementById('european-competitions');
        europeanContainer.innerHTML = LEAGUES_DATA.europeanCompetitions
            .filter(league => !filterCountry || league.country.toLowerCase() === filterCountry)
            .map(createLeagueCard)
            .join('');

        // Render other leagues
        const otherLeaguesContainer = document.getElementById('other-leagues');
        otherLeaguesContainer.innerHTML = LEAGUES_DATA.otherLeagues
            .filter(league => !filterCountry || league.country.toLowerCase() === filterCountry)
            .map(createLeagueCard)
            .join('');

        // Hide empty sections
        document.querySelectorAll('.league-section').forEach(section => {
            const cards = section.querySelector('.leagues-cards');
            section.style.display = cards.children.length > 0 ? 'block' : 'none';
        });
    }

    function setupFilters() {
        const countryFilter = document.getElementById('country-filter');
        countryFilter.addEventListener('change', (e) => {
            renderLeagues(e.target.value);
        });
    }

    // Fetch real-time data
    async function fetchLeaguesData() {
        try {
            const response = await fetch('http://localhost:3000/api/leagues');
            const data = await response.json();
            // Update UI with new data
            updateLeaguesData(data);
        } catch (error) {
            console.error('Failed to fetch leagues data:', error);
        }
    }

    function updateLeaguesData(data) {
        // Update featured league
        if (data.featured) {
            document.querySelector('.league-banner-img').src = data.featured.banner;
            document.querySelector('.league-logo').src = data.featured.logo;
            document.querySelector('.league-details h2').textContent = data.featured.name;
            document.querySelector('.league-details p').textContent = data.featured.country;
        }

        // Update stats
        if (data.stats) {
            document.querySelectorAll('.stat-value').forEach(stat => {
                const statType = stat.parentElement.querySelector('h3').textContent.toLowerCase();
                if (data.stats[statType]) {
                    stat.textContent = data.stats[statType];
                }
            });
        }
    }

    // Initialize real-time updates
    fetchLeaguesData();
    setInterval(fetchLeaguesData, 300000); // Refresh every 5 minutes
});
