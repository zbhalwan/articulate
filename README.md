# Articulate - Online Board Game

A real-time multiplayer web implementation of the popular Articulate board game, built with Next.js, React, and Socket.io.

## Features

- 🎮 **Real-time Multiplayer** - Play with friends from different devices
- 👥 **Two Team System** - Split into 2 teams and compete
- 🎯 **Category-Based Squares** - Each board space has a specific category theme
- 🎨 **Colorful Board Design** - Clean grid layout with color-coded category squares
- 👤 **Player Visibility** - See all players, their teams, and who's describing
- 📊 **Live Game Board** - Visual board showing team positions in real-time
- ⏱️ **30-Second Rounds** - Fast-paced gameplay with countdown timer
- 📱 **Mobile Optimized** - Fully responsive design for phones and tablets
- 🎨 **Modern UI** - Clean, intuitive interface with smooth animations

## Game Rules

1. Split players into 2 teams
2. Teams take turns with one player being the "describer"
3. **The describer gets words based on the category of their current square**
4. The describer cannot say the word, parts of it, or rhyming words
5. Teams have 30 seconds to guess as many words as possible
6. **Teams move forward on the board based on correct guesses**
7. **Land on different colored squares for different categories!**
8. First team to reach the finish wins!

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **Socket.io Client** - Real-time communication
- **Framer Motion** - Animations
- **CSS Modules** - Scoped styling

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Socket.io** - WebSocket server for real-time features
- **ES Modules** - Modern JavaScript

## Project Structure

```
articulate/
├── frontend/               # Next.js frontend application
│   ├── src/
│   │   ├── app/           # Next.js app directory
│   │   │   ├── page.js    # Home page
│   │   │   ├── layout.js  # Root layout
│   │   │   └── globals.css
│   │   ├── components/    # React components
│   │   │   ├── Lobby/     # Room creation and joining
│   │   │   ├── Game/      # Main game component
│   │   │   └── GameBoard/ # Visual board display
│   │   └── contexts/      # React contexts
│   │       └── SocketContext.js
│   ├── package.json
│   └── next.config.js
│
├── backend/               # Express + Socket.io backend
│   ├── src/
│   │   ├── server.js      # Main server file
│   │   └── game/          # Game logic
│   │       ├── GameManager.js  # Room and game state management
│   │       └── WordBank.js     # Word categories and selection
│   └── package.json
│
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:3001`

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

### Quick Start (Both Servers)

You can also run both servers from the root directory:

```bash
# Terminal 1 - Backend
cd backend && npm install && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm install && npm run dev
```

## How to Play

1. **Create or Join a Room**
   - One player creates a room and shares the room code
   - Other players join using the room code
   - Players choose their team (Team 1 or Team 2)

2. **Start the Game**
   - The host starts the game when all players are ready
   - Both teams must have at least one player

3. **Playing a Turn**
   - The describing player sees a word and category
   - They have 30 seconds to describe as many words as possible
   - Teammates shout out guesses
   - Click "Correct" for right answers, "Skip" to pass
   - Click "End Turn" when time is up or ready to finish

4. **Winning**
   - Teams move forward based on correct guesses
   - First team to reach space 30 wins!

## Game Categories

Each square on the board has a specific category, shown by its color:

- **OBJECT** (Red) - Everyday items and things
- **PERSON** (Teal) - Professions and roles  
- **ACTION** (Mint) - Verbs and activities
- **WORLD** (Coral) - Places and geography
- **NATURE** (Purple) - Animals and natural world
- **RANDOM** (Pink) - Abstract concepts and ideas
- **START** (Yellow) - Starting position (random words)
- **FINISH** (Gold) - Winning position!

## Mobile Support

The app is fully optimized for mobile devices:
- Touch-friendly controls with minimum 44px tap targets
- Responsive layout that adapts to screen size
- Portrait and landscape orientation support
- Optimized font sizes and spacing for mobile
- Smooth animations and transitions

## Potential Features

We have exciting plans to enhance Articulate! Here are some potential features organized by category:

### 🎯 Gameplay Enhancements
- **Special Board Squares** - Add spin squares, control squares, and challenge squares for more strategic gameplay
- **Power-Ups** - Time extensions, hint reveals, or bonus points for exciting gameplay twists
- **Multiple Game Modes** - Classic mode, speed mode, team battle, and elimination rounds
- **Difficulty Levels** - Easy, medium, and hard word packs to accommodate different skill levels
- **Custom Word Packs** - Allow users to create and share their own themed word collections
- **Bonus Rounds** - Special challenge rounds with unique rules and higher stakes
- **Wheel Spins** - Add a spinner mechanic to determine move distance or special actions

### 👥 Social Features
- **In-Game Chat** - Text chat for players to communicate during the game
- **Voice Chat Integration** - Optional voice channels for remote play
- **Friend System** - Add friends and invite them directly to games
- **Lobby System** - Public and private lobbies for finding new players
- **Player Profiles** - Customizable avatars, bios, and display names
- **Team Formation Tools** - Auto-balance teams or create preset team combinations

### 📊 Statistics & Progression
- **Player Statistics** - Track wins, losses, words guessed, and accuracy rates
- **Leaderboards** - Global and friend leaderboards for competitive players
- **Achievement System** - Unlock badges for milestones and special accomplishments
- **Match History** - Review past games with detailed stats and replays
- **Performance Analytics** - Insights into category strengths and improvement areas
- **Season Rankings** - Competitive seasons with rewards and rankings

### 🎨 Customization & Personalization
- **Custom Themes** - Different visual themes and color schemes
- **Board Customization** - Design your own board layouts and square arrangements
- **Sound Packs** - Choose from different sound effect and music collections
- **Language Support** - Multi-language word packs and UI translations
- **Accessibility Options** - High contrast modes, text-to-speech, and other accessibility features
- **Custom Room Settings** - Adjustable timer lengths, board sizes, and rule variations

### 🏆 Competitive & Tournament Features
- **Tournament Mode** - Structured tournaments with brackets and elimination rounds
- **Ranked Matches** - MMR-based matchmaking for competitive play
- **Spectator Mode** - Allow non-players to watch ongoing games
- **Replay System** - Record and share memorable game moments
- **Private Leagues** - Create custom leagues for friends or communities
- **Daily Challenges** - Special daily puzzles and challenges with rewards

### 🔧 Technical Improvements
- **Mobile App** - Native iOS and Android applications
- **Offline Mode** - Play against AI or practice mode without internet
- **Performance Optimization** - Faster load times and smoother animations
- **Better Reconnection** - Improved handling of disconnects and network issues
- **Save & Resume** - Save game state and resume later
- **Cross-Platform Sync** - Continue games across different devices
- **AI Opponents** - Practice with computer-controlled players

### 🌐 Community & Content
- **Community Word Banks** - User-submitted and voted word collections
- **Content Rating System** - Rate and review custom word packs
- **Event Calendar** - Scheduled community events and special game modes
- **Streaming Integration** - Twitch and YouTube streaming support
- **Educational Mode** - Word packs designed for learning and education
- **Themed Events** - Holiday-themed boards and special seasonal content

### 🎮 Additional Game Variants
- **Solo Practice Mode** - Practice describing words against the clock
- **Co-op Mode** - All players work together against challenging goals
- **Trivia Integration** - Combine Articulate with trivia questions
- **Speed Articulate** - Faster-paced version with shorter rounds
- **Charades Mode** - Silent description variant using gestures only
- **Reverse Mode** - Guessers describe while one person guesses

We welcome community feedback and contributions! Feel free to suggest new features or vote on your favorites.

## License

MIT License - See LICENSE file for details

## Credits

Based on the popular Articulate! board game. This is a fan-made digital implementation for educational purposes.
