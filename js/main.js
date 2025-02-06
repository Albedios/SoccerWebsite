document.addEventListener('DOMContentLoaded', () => {
    // API endpoints
    const API = {
        STANDINGS: 'http://localhost:3000/api/standings/PL', // Premier League
        MATCHES: 'http://localhost:3000/api/matches/PL',
        PLAYERS: 'http://localhost:3000/api/players'
    };

    // Fallback data for when API fails
    const FALLBACK_DATA = {
        standings: {
            standings: [{
                table: [
                    { position: 1, team: { name: 'Loading...' }, playedGames: '-', won: '-', draw: '-', lost: '-', points: '-' },
                    { position: 2, team: { name: 'Loading...' }, playedGames: '-', won: '-', draw: '-', lost: '-', points: '-' },
                    { position: 3, team: { name: 'Loading...' }, playedGames: '-', won: '-', draw: '-', lost: '-', points: '-' }
                ]
            }]
        },
        matches: {
            matches: [
                {
                    homeTeam: { name: 'Loading...' },
                    awayTeam: { name: 'Loading...' },
                    utcDate: new Date().toISOString()
                }
            ]
        }
    };

    // Retry configuration
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 5000; // 5 seconds
    const AUTO_REFRESH_INTERVAL = 300000; // 5 minutes

    // Loading state handler
    const showLoading = (element) => {
        element.classList.add('loading');
        const loader = document.createElement('div');
        loader.className = 'loader';
        loader.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        element.appendChild(loader);
    };

    const hideLoading = (element) => {
        element.classList.remove('loading');
        const loader = element.querySelector('.loader');
        if (loader) loader.remove();
    };

    // Error handling
    const showError = (message, element = null, retryCallback = null) => {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
            ${retryCallback ? `
                <button class="retry-button">
                    <i class="fas fa-redo"></i> Retry
                </button>
            ` : ''}
        `;
        
        if (retryCallback) {
            const retryButton = errorDiv.querySelector('.retry-button');
            retryButton.addEventListener('click', () => {
                errorDiv.remove();
                retryCallback();
            });
        }
        
        if (element) {
            element.appendChild(errorDiv);
            return errorDiv;
        } else {
            document.body.appendChild(errorDiv);
            setTimeout(() => errorDiv.remove(), 5000);
        }
    };

    // Fetch data with retries and error handling
    async function fetchData(url, type) {
        let retries = 0;
        
        while (retries < MAX_RETRIES) {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }
                return await response.json();
            } catch (error) {
                console.error('Fetch error:', error);
                retries++;
                
                if (retries === MAX_RETRIES) {
                    if (type in FALLBACK_DATA) {
                        console.log(`Using fallback data for ${type}`);
                        return FALLBACK_DATA[type];
                    }
                    throw error;
                }
                
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * retries));
            }
        }
    }

    // Populate league standings
    async function populateStandings() {
        const tbody = document.querySelector('#standings-table tbody');
        const section = document.querySelector('.league-standings');
        
        showLoading(section);
        try {
            const data = await fetchData(API.STANDINGS, 'standings');
            tbody.innerHTML = '';

            data.standings[0].table.forEach((team, index) => {
                const row = document.createElement('tr');
                row.style.opacity = '0';
                row.style.transform = 'translateX(-10px)';
                row.style.transition = 'all 0.3s ease';
                
                row.innerHTML = `
                    <td><strong>${team.position}</strong></td>
                    <td><i class="fas fa-shield-alt"></i> <strong>${team.team.name}</strong></td>
                    <td><i class="fas fa-running"></i> ${team.playedGames}</td>
                    <td><i class="fas fa-check text-success"></i> ${team.won}</td>
                    <td><i class="fas fa-equals"></i> ${team.draw}</td>
                    <td><i class="fas fa-times text-danger"></i> ${team.lost}</td>
                    <td><i class="fas fa-star"></i> <strong>${team.points}</strong></td>
                `;
                tbody.appendChild(row);

                setTimeout(() => {
                    row.style.opacity = '1';
                    row.style.transform = 'none';
                }, index * 100);
            });
        } catch (error) {
            showError('Failed to load standings', section, populateStandings);
        } finally {
            hideLoading(section);
        }
    }

    // Populate upcoming matches
    async function populateMatches() {
        const container = document.getElementById('matches-container');
        const section = document.querySelector('.upcoming-matches');
        
        showLoading(section);
        try {
            const data = await fetchData(API.MATCHES, 'matches');
            container.innerHTML = '';

            const upcomingMatches = data.matches
                .filter(match => new Date(match.utcDate) > new Date())
                .slice(0, 5);

            if (upcomingMatches.length === 0) {
                container.innerHTML = '<div class="no-matches">No upcoming matches scheduled</div>';
                return;
            }

            upcomingMatches.forEach((match, index) => {
                const card = document.createElement('div');
                card.className = 'match-card';
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                card.style.transition = 'all 0.3s ease';
                
                const matchDate = new Date(match.utcDate);
                const formattedDate = matchDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                const formattedTime = matchDate.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                });

                const isToday = new Date().toDateString() === matchDate.toDateString();
                const timeUntilMatch = getTimeUntilMatch(matchDate);
                
                card.innerHTML = `
                    <div class="vs-badge"><i class="fas fa-bolt"></i> VS</div>
                    <h3>
                        <i class="fas fa-shield-alt"></i> ${match.homeTeam.name}
                        <span class="vs-text">vs</span>
                        <i class="fas fa-shield-alt"></i> ${match.awayTeam.name}
                    </h3>
                    <p class="date">
                        <i class="fas fa-calendar-alt"></i> 
                        ${formattedDate} 
                        ${isToday ? '<span class="today-badge"><i class="fas fa-star"></i> Today</span>' : ''}
                    </p>
                    <p class="time">
                        <i class="fas fa-clock"></i> Kickoff: ${formattedTime}
                    </p>
                    <p class="countdown">
                        <i class="fas fa-hourglass-half"></i> ${timeUntilMatch}
                    </p>
                `;

                container.appendChild(card);

                card.addEventListener('mouseenter', () => {
                    card.style.transform = 'scale(1.02)';
                });

                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'scale(1)';
                });

                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, index * 150);
            });
        } catch (error) {
            showError('Failed to load matches', section, populateMatches);
        } finally {
            hideLoading(section);
        }
    }

    function getTimeUntilMatch(matchDate) {
        const now = new Date();
        const diffMs = matchDate - now;
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) {
            return `${days}d ${hours}h until kickoff`;
        } else if (hours > 0) {
            return `${hours}h ${minutes}m until kickoff`;
        } else if (minutes > 0) {
            return `${minutes} minutes until kickoff`;
        } else {
            return 'Starting soon!';
        }
    }

    // Auto refresh data
    function setupAutoRefresh() {
        setInterval(() => {
            populateStandings();
            populateMatches();
        }, AUTO_REFRESH_INTERVAL);
    }

    // Add CSS for new elements
    const style = document.createElement('style');
    style.textContent = `
        .loading {
            position: relative;
            min-height: 200px;
        }

        .loader {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 2rem;
            color: var(--secondary-color);
        }

        .error-message {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #ff4444;
            color: white;
            padding: 1rem;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .retry-button {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .retry-button:hover {
            background: rgba(255, 255, 255, 0.3);
        }

        .no-matches {
            text-align: center;
            padding: 2rem;
            color: var(--secondary-color);
            font-style: italic;
        }

        .countdown {
            color: var(--primary-color);
            font-size: 0.9em;
            margin-top: 0.5rem;
        }

        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }

        .today-badge {
            background: var(--primary-color);
            color: var(--text-color);
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.8em;
            margin-left: 8px;
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }

        .vs-badge {
            position: absolute;
            top: -10px;
            right: 10px;
            background: var(--secondary-color);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8em;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .match-card {
            position: relative;
        }

        .time {
            color: var(--secondary-color);
            font-weight: bold;
        }

        .vs-text {
            color: var(--secondary-color);
            margin: 0 0.5rem;
            font-size: 0.9em;
        }

        .text-success { color: #28a745; }
        .text-danger { color: #dc3545; }

        td i {
            margin-right: 0.5rem;
        }
    `;
    document.head.appendChild(style);

    // Initialize
    setTimeout(() => {
        populateStandings();
        setTimeout(populateMatches, 300);
        setupAutoRefresh();
    }, 100);
});
