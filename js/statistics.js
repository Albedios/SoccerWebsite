document.addEventListener('DOMContentLoaded', () => {
    // Set Chart.js default styles to match theme
    Chart.defaults.color = getComputedStyle(document.documentElement)
        .getPropertyValue('--text-color')
        .trim();
    Chart.defaults.borderColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--border-color')
        .trim();

    // Initialize charts
    initializeGoalsChart();
    initializePerformanceChart();
    loadHistoricalStats();

    // Event listeners
    document.getElementById('season-select').addEventListener('change', updateStats);

    function initializeGoalsChart() {
        const ctx = document.getElementById('goalsChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['0-15', '16-30', '31-45', '45+', '46-60', '61-75', '76-90', '90+'],
                datasets: [{
                    label: 'Goals Scored',
                    data: [125, 142, 156, 22, 138, 168, 178, 35],
                    backgroundColor: getComputedStyle(document.documentElement)
                        .getPropertyValue('--primary-color')
                        .trim(),
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Goals by Time Interval'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Goals'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Match Time (minutes)'
                        }
                    }
                }
            }
        });
    }

    function initializePerformanceChart() {
        const ctx = document.getElementById('performanceChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 5', 'Week 10', 'Week 15', 'Week 20', 'Week 25', 'Current'],
                datasets: [
                    {
                        label: 'Manchester City',
                        data: [3, 13, 25, 34, 46, 55, 63],
                        borderColor: '#98C3E7',
                        fill: false,
                        tension: 0.3
                    },
                    {
                        label: 'Liverpool',
                        data: [3, 15, 28, 37, 43, 52, 61],
                        borderColor: '#E31B23',
                        fill: false,
                        tension: 0.3
                    },
                    {
                        label: 'Arsenal',
                        data: [3, 12, 24, 35, 44, 50, 58],
                        borderColor: '#EF0107',
                        fill: false,
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Points Progression'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Points'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Game Week'
                        }
                    }
                }
            }
        });
    }

    function loadHistoricalStats() {
        const historicalData = [
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
        ];

        const tbody = document.getElementById('historical-stats-tbody');
        tbody.innerHTML = historicalData.map(season => `
            <tr>
                <td>${season.season}</td>
                <td>${season.champion}</td>
                <td>${season.topScorer}</td>
                <td>${season.mostAssists}</td>
                <td>${season.goals}</td>
                <td>${season.cards}</td>
            </tr>
        `).join('');
    }

    async function updateStats(event) {
        const season = event.target.value;
        try {
            const response = await fetch(`http://localhost:3000/api/statistics/${season}`);
            const data = await response.json();
            // Update UI with new data
            updateStatCards(data);
            updateCharts(data);
            loadHistoricalStats();
        } catch (error) {
            console.error('Failed to fetch statistics:', error);
        }
    }

    function updateStatCards(data) {
        // Update stat cards with new data
        // This would be implemented based on the API response structure
    }

    function updateCharts(data) {
        // Update charts with new data
        // This would be implemented based on the API response structure
    }

    // Handle theme changes
    document.addEventListener('themeChanged', () => {
        // Update chart colors when theme changes
        Chart.helpers.each(Chart.instances, (chart) => {
            chart.options.plugins.legend.labels.color = getComputedStyle(document.documentElement)
                .getPropertyValue('--text-color')
                .trim();
            chart.options.scales.x.grid.color = getComputedStyle(document.documentElement)
                .getPropertyValue('--border-color')
                .trim();
            chart.options.scales.y.grid.color = getComputedStyle(document.documentElement)
                .getPropertyValue('--border-color')
                .trim();
            chart.update();
        });
    });
});
