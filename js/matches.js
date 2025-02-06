document.addEventListener('DOMContentLoaded', () => {
    const MATCHES_DATA = {
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
            },
            {
                id: 'match-2',
                homeTeam: {
                    name: 'Arsenal',
                    logo: 'https://crests.football-data.org/57.svg'
                },
                awayTeam: {
                    name: 'Manchester United',
                    logo: 'https://crests.football-data.org/66.svg'
                },
                date: '2025-02-15T17:30:00',
                venue: 'Emirates Stadium',
                competition: 'Premier League',
                status: 'SCHEDULED'
            }
        ],
        live: [],
        past: [
            {
                id: 'match-3',
                homeTeam: {
                    name: 'Chelsea',
                    logo: 'https://crests.football-data.org/61.svg',
                    score: 2
                },
                awayTeam: {
                    name: 'Tottenham',
                    logo: 'https://crests.football-data.org/73.svg',
                    score: 1
                },
                date: '2025-02-01T15:00:00',
                venue: 'Stamford Bridge',
                competition: 'Premier League',
                status: 'FINISHED',
                stats: {
                    possession: { home: 55, away: 45 },
                    shots: { home: 15, away: 10 },
                    shotsOnTarget: { home: 7, away: 4 },
                    corners: { home: 8, away: 5 }
                }
            }
        ]
    };

    const matchesContainer = document.querySelector('.matches-container');
    const modal = document.querySelector('.match-details-modal');
    const filterButtons = document.querySelectorAll('.filter-btn');
    let currentFilter = 'upcoming';

    function formatDate(dateString) {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-GB', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }

    function createMatchCard(match) {
        const isLive = match.status === 'IN_PROGRESS';
        const isPast = match.status === 'FINISHED';
        
        return `
            <div class="match-card" data-match-id="${match.id}" onclick="showMatchDetails('${match.id}')">
                <div class="match-status ${isLive ? 'live' : ''}">
                    ${isLive ? '<i class="fas fa-circle live-indicator"></i> LIVE' :
                      isPast ? 'FINISHED' : 'UPCOMING'}
                </div>
                <div class="match-teams">
                    <div class="team">
                        <div class="team-logo">
                            <img src="${match.homeTeam.logo}" alt="${match.homeTeam.name} logo" loading="lazy">
                        </div>
                        <span class="team-name">${match.homeTeam.name}</span>
                        ${isPast ? `<span class="score">${match.homeTeam.score}</span>` : ''}
                    </div>
                    <div class="vs">VS</div>
                    <div class="team">
                        <div class="team-logo">
                            <img src="${match.awayTeam.logo}" alt="${match.awayTeam.name} logo" loading="lazy">
                        </div>
                        <span class="team-name">${match.awayTeam.name}</span>
                        ${isPast ? `<span class="score">${match.awayTeam.score}</span>` : ''}
                    </div>
                </div>
                <div class="match-info">
                    <span class="match-date">
                        <i class="far fa-calendar-alt"></i>
                        ${formatDate(match.date)}
                    </span>
                    <span class="match-venue">
                        <i class="fas fa-map-marker-alt"></i>
                        ${match.venue}
                    </span>
                </div>
            </div>
        `;
    }

    function showMatchDetails(matchId) {
        const match = [...MATCHES_DATA.upcoming, ...MATCHES_DATA.live, ...MATCHES_DATA.past]
            .find(m => m.id === matchId);
        
        if (!match) return;

        const isPast = match.status === 'FINISHED';
        const content = `
            <div class="match-detail-header">
                <h2>${match.competition}</h2>
                <span class="match-date">${formatDate(match.date)}</span>
            </div>
            <div class="match-teams-detail">
                <div class="team">
                    <div class="team-logo">
                        <img src="${match.homeTeam.logo}" alt="${match.homeTeam.name} logo">
                    </div>
                    <h3 class="team-name">${match.homeTeam.name}</h3>
                    ${isPast ? `<div class="score">${match.homeTeam.score}</div>` : ''}
                </div>
                <div class="vs-detail">
                    <span>VS</span>
                    <div class="venue">${match.venue}</div>
                </div>
                <div class="team">
                    <div class="team-logo">
                        <img src="${match.awayTeam.logo}" alt="${match.awayTeam.name} logo">
                    </div>
                    <h3 class="team-name">${match.awayTeam.name}</h3>
                    ${isPast ? `<div class="score">${match.awayTeam.score}</div>` : ''}
                </div>
            </div>
            ${isPast ? `
                <div class="match-statistics">
                    <h3>Match Statistics</h3>
                    <div class="stat-row">
                        <span>${match.stats.possession.home}%</span>
                        <div class="stat-label">Possession</div>
                        <span>${match.stats.possession.away}%</span>
                    </div>
                    <div class="stat-row">
                        <span>${match.stats.shots.home}</span>
                        <div class="stat-label">Shots</div>
                        <span>${match.stats.shots.away}</span>
                    </div>
                    <div class="stat-row">
                        <span>${match.stats.shotsOnTarget.home}</span>
                        <div class="stat-label">Shots on Target</div>
                        <span>${match.stats.shotsOnTarget.away}</span>
                    </div>
                    <div class="stat-row">
                        <span>${match.stats.corners.home}</span>
                        <div class="stat-label">Corners</div>
                        <span>${match.stats.corners.away}</span>
                    </div>
                </div>
            ` : ''}
        `;

        document.querySelector('.match-details-content').innerHTML = content;
        modal.classList.add('visible');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('visible');
        document.body.style.overflow = '';
    }

    function filterMatches(type) {
        currentFilter = type;
        document.getElementById('matches-heading').textContent = 
            type.charAt(0).toUpperCase() + type.slice(1) + ' Matches';
        
        const matches = MATCHES_DATA[type];
        matchesContainer.innerHTML = matches.length ? 
            matches.map(match => createMatchCard(match)).join('') :
            `<div class="no-matches">No ${type} matches found</div>`;
    }

    // Event Listeners
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterMatches(btn.dataset.filter);
        });
    });

    document.querySelector('.close-modal').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Make showMatchDetails available globally
    window.showMatchDetails = showMatchDetails;

    // Initialize with upcoming matches
    filterMatches('upcoming');

    // Auto-refresh data every 5 minutes
    setInterval(async () => {
        try {
            const response = await fetch('http://localhost:3000/api/matches');
            const data = await response.json();
            
            // Update matches data
            Object.assign(MATCHES_DATA, data);
            
            // Refresh the current view
            filterMatches(currentFilter);
        } catch (error) {
            console.error('Failed to refresh match data:', error);
        }
    }, 300000);
});
