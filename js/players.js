document.addEventListener('DOMContentLoaded', () => {
    // Sample player data (would be fetched from API in production)
    const PLAYERS_DATA = [
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
        }
    ];

    // Elements
    const playerSearch = document.getElementById('player-search');
    const teamFilter = document.getElementById('team-filter');
    const positionFilter = document.getElementById('position-filter');
    const statSort = document.getElementById('stat-sort');
    const playersTableBody = document.getElementById('players-tbody');

    // Populate team filter
    const teams = [...new Set(PLAYERS_DATA.map(player => player.team))];
    teams.forEach(team => {
        const option = document.createElement('option');
        option.value = team;
        option.textContent = team;
        teamFilter.appendChild(option);
    });

    // Filter and sort players
    function filterAndSortPlayers() {
        const searchTerm = playerSearch.value.toLowerCase();
        const teamValue = teamFilter.value;
        const positionValue = positionFilter.value;
        const sortValue = statSort.value;

        let filteredPlayers = PLAYERS_DATA.filter(player => {
            const matchesSearch = player.name.toLowerCase().includes(searchTerm);
            const matchesTeam = !teamValue || player.team === teamValue;
            const matchesPosition = !positionValue || player.position === positionValue;
            return matchesSearch && matchesTeam && matchesPosition;
        });

        // Sort players
        filteredPlayers.sort((a, b) => b[sortValue] - a[sortValue]);

        renderPlayers(filteredPlayers);
    }

    function renderPlayers(players) {
        playersTableBody.innerHTML = '';

        if (players.length === 0) {
            playersTableBody.innerHTML = `
                <tr>
                    <td colspan="10" class="text-center">No players found</td>
                </tr>
            `;
            return;
        }

        players.forEach(player => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="player-name-cell">
                        <img src="${player.image}" alt="${player.name}" width="30" height="30" style="border-radius: 50%; margin-right: 10px;">
                        ${player.name}
                    </div>
                </td>
                <td>${player.team}</td>
                <td>${player.position}</td>
                <td>${player.age}</td>
                <td>${player.games}</td>
                <td>${player.goals}</td>
                <td>${player.assists}</td>
                <td>${player.cleanSheets}</td>
                <td>${player.yellowCards}</td>
                <td>${player.redCards}</td>
            `;
            playersTableBody.appendChild(row);
        });
    }

    // Event listeners
    playerSearch.addEventListener('input', filterAndSortPlayers);
    teamFilter.addEventListener('change', filterAndSortPlayers);
    positionFilter.addEventListener('change', filterAndSortPlayers);
    statSort.addEventListener('change', filterAndSortPlayers);

    // Fetch real-time data
    async function fetchPlayerData() {
        try {
            const response = await fetch('http://localhost:3000/api/players');
            const data = await response.json();
            // Update UI with new data
            renderPlayers(data);
        } catch (error) {
            console.error('Failed to fetch player data:', error);
            // Use sample data as fallback
            renderPlayers(PLAYERS_DATA);
        }
    }

    // Initialize
    renderPlayers(PLAYERS_DATA);
    setInterval(fetchPlayerData, 300000); // Refresh every 5 minutes
});
