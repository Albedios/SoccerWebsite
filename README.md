# Soccer Stats Hub

A real-time soccer statistics website featuring live standings, upcoming matches, and player statistics.

## Features

- Live league standings with automatic updates
- Upcoming matches with countdown timers
- Player statistics and performance metrics
- Interactive particle background that responds to team selection
- Responsive design for all devices
- Sortable statistics tables
- Error handling and loading states
- Data caching for optimal performance

## Prerequisites

Before running the project, you'll need:

1. Node.js (v14 or higher)
2. An API key from football-data.org

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd soccer-website
```

2. Install dependencies:
```bash
npm install
```

3. Get your API key:
- Go to [football-data.org](https://www.football-data.org/)
- Sign up for a free account
- Copy your API key from your account dashboard

4. Create a .env file in the project root:
```bash
PORT=3000
FOOTBALL_API_KEY=your_api_key_here
```

5. Start the server:
```bash
npm run dev
```

6. Open your browser and navigate to:
```
http://localhost:3000
```

## Development

- `npm run dev` - Starts the server with hot-reload using nodemon
- `npm start` - Starts the server in production mode

## Project Structure

```
soccer-website/
├── css/
│   ├── style.css
│   └── teams.css
├── js/
│   ├── background.js    # Particle system and animations
│   ├── main.js         # Core functionality and match data
│   ├── statistics.js   # Player statistics handling
│   └── themes.js       # Theme management
├── server/
│   └── server.js       # Express backend server
└── index.html          # Main HTML file
```

## API Endpoints

- `/api/standings/:leagueId` - Get league standings
- `/api/matches/:leagueId` - Get upcoming matches
- `/api/players/:teamId` - Get team player statistics

The API includes caching to minimize requests to the football-data.org API.

## Cache Duration

- League standings: 5 minutes
- Matches: 5 minutes
- Player statistics: 5 minutes

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Technologies Used

- Frontend:
  - HTML5
  - CSS3 with custom properties
  - Vanilla JavaScript (ES6+)
  - p5.js for particle system
  - Font Awesome for icons

- Backend:
  - Node.js
  - Express
  - node-fetch
  - dotenv for configuration

## License

MIT License

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## Notes

- The free tier of football-data.org API has rate limits. Check their documentation for details.
- Some features may require a paid API subscription for full functionality.
