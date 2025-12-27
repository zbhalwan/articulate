import { v4 as uuidv4 } from 'uuid';
import { WordBank } from './WordBank.js';

export class GameManager {
  constructor() {
    this.rooms = new Map();
    this.wordBank = new WordBank();
  }

  createRoom(playerId, playerName) {
    const roomId = this.generateRoomCode();
    
    // Define board spaces with categories
    const boardSpaces = this.generateBoardSpaces(30);
    
    const room = {
      id: roomId,
      host: playerId,
      players: [
        {
          id: playerId,
          name: playerName,
          teamId: 1
        }
      ],
      teams: {
        1: { id: 1, name: 'Team 1', position: 0, color: '#FF6B6B', playerNames: [playerName] },
        2: { id: 2, name: 'Team 2', position: 0, color: '#4ECDC4', playerNames: [] }
      },
      state: 'lobby', // lobby, playing, finished
      currentTeam: 1,
      currentPlayer: null,
      currentPlayerName: null,
      describerIndex: 0, // Track which player's turn to describe
      turnScore: 0,
      turnWords: [],
      boardSize: 30,
      boardSpaces: boardSpaces
    };
    
    this.rooms.set(roomId, room);
    return room;
  }

  generateBoardSpaces(size) {
    const categories = ['OBJECT', 'PERSON', 'ACTION', 'WORLD', 'NATURE', 'RANDOM'];
    const categoryColors = {
      'OBJECT': '#FF6B6B',
      'PERSON': '#4ECDC4', 
      'ACTION': '#95E1D3',
      'WORLD': '#F38181',
      'NATURE': '#AA96DA',
      'RANDOM': '#FCBAD3'
    };
    
    const spaces = [];
    for (let i = 0; i < size; i++) {
      if (i === 0) {
        spaces.push({ index: i, category: 'START', color: '#FFD93D', label: 'START' });
      } else if (i === size - 1) {
        spaces.push({ index: i, category: 'FINISH', color: '#FFD700', label: 'FINISH' });
      } else {
        const category = categories[i % categories.length];
        spaces.push({ 
          index: i, 
          category: category, 
          color: categoryColors[category],
          label: category
        });
      }
    }
    return spaces;
  }

  generateRoomCode() {
    // Generate a 6-character room code
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  joinRoom(roomId, playerId, playerName, teamId) {
    const room = this.rooms.get(roomId);
    
    if (!room) {
      return { success: false, error: 'Room not found' };
    }

    if (room.state !== 'lobby') {
      return { success: false, error: 'Game already in progress' };
    }

    if (room.players.length >= 12) {
      return { success: false, error: 'Room is full' };
    }

    const player = {
      id: playerId,
      name: playerName,
      teamId: teamId || (room.players.length % 2 === 0 ? 1 : 2)
    };

    room.players.push(player);
    
    // Update team player names
    room.teams[player.teamId].playerNames.push(playerName);
    
    return { success: true, room };
  }

  startGame(roomId, playerId) {
    const room = this.rooms.get(roomId);
    
    if (!room) {
      return { success: false, error: 'Room not found' };
    }

    if (room.host !== playerId) {
      return { success: false, error: 'Only the host can start the game' };
    }

    if (room.players.length < 2) {
      return { success: false, error: 'Need at least 2 players to start' };
    }

    // Check that both teams have players
    const team1Players = room.players.filter(p => p.teamId === 1);
    const team2Players = room.players.filter(p => p.teamId === 2);
    
    if (team1Players.length === 0 || team2Players.length === 0) {
      return { success: false, error: 'Both teams need at least one player' };
    }

    room.state = 'playing';
    room.currentTeam = 1;
    room.describerIndex = 0;
    room.currentPlayer = room.players[0].id;
    room.currentPlayerName = room.players[0].name;
    
    return { success: true, room };
  }

  startTurn(roomId, playerId) {
    const room = this.rooms.get(roomId);
    
    if (!room) {
      return { success: false, error: 'Room not found' };
    }

    if (room.state !== 'playing') {
      return { success: false, error: 'Game not in progress' };
    }

    // Only the designated describer can start their turn
    if (room.currentPlayer !== playerId) {
      return { success: false, error: 'Not your turn to describe' };
    }

    // Initialize turn
    room.turnScore = 0;
    room.turnWords = [];

    // Get category based on current position
    const currentPosition = room.teams[room.currentTeam].position;
    const spaceCategory = room.boardSpaces[currentPosition].category;
    
    // Get word from that category, or random if START/FINISH
    let word;
    if (spaceCategory === 'START' || spaceCategory === 'FINISH') {
      word = this.wordBank.getRandomWord();
    } else {
      word = this.wordBank.getWordByCategory(spaceCategory);
    }
    
    return { 
      success: true, 
      word: word.word,
      category: word.category,
      teamId: room.currentTeam,
      playerName: room.currentPlayerName
    };
  }

  wordCorrect(roomId, playerId) {
    const room = this.rooms.get(roomId);
    
    if (!room) {
      return { success: false, error: 'Room not found' };
    }

    if (room.currentPlayer !== playerId) {
      return { success: false, error: 'Not your turn' };
    }

    room.turnScore++;
    
    return { 
      success: true, 
      score: room.turnScore,
      teamId: room.currentTeam
    };
  }

  skipWord(roomId, playerId) {
    const room = this.rooms.get(roomId);
    
    if (!room) {
      return { success: false, error: 'Room not found' };
    }

    if (room.currentPlayer !== playerId) {
      return { success: false, error: 'Not your turn' };
    }

    return { success: true };
  }

  getNextWord(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) {
      return this.wordBank.getRandomWord();
    }
    
    // Get category based on current position
    const currentPosition = room.teams[room.currentTeam].position;
    const spaceCategory = room.boardSpaces[currentPosition].category;
    
    // Get word from that category
    if (spaceCategory === 'START' || spaceCategory === 'FINISH') {
      return this.wordBank.getRandomWord();
    } else {
      return this.wordBank.getWordByCategory(spaceCategory);
    }
  }

  endTurn(roomId, playerId) {
    const room = this.rooms.get(roomId);
    
    if (!room) {
      return { success: false, error: 'Room not found' };
    }

    // Update team position
    const team = room.teams[room.currentTeam];
    team.position += room.turnScore;

    const score = room.turnScore;
    const teamId = room.currentTeam;
    
    // Check for winner
    let gameOver = false;
    let winner = null;
    
    if (team.position >= room.boardSize) {
      gameOver = true;
      winner = teamId;
      room.state = 'finished';
    }

    // Switch to next team and rotate describers fairly
    const nextTeamId = room.currentTeam === 1 ? 2 : 1;
    
    // Get players for each team
    const team1Players = room.players.filter(p => p.teamId === 1);
    const team2Players = room.players.filter(p => p.teamId === 2);
    
    // Calculate which player index within each team should go next
    // describerIndex tracks total turns taken
    room.describerIndex++;
    
    let nextDescriber;
    if (nextTeamId === 1) {
      // Team 1's turn
      const team1Index = Math.floor(room.describerIndex / 2);
      nextDescriber = team1Players[team1Index % team1Players.length];
    } else {
      // Team 2's turn
      const team2Index = Math.floor((room.describerIndex - 1) / 2);
      nextDescriber = team2Players[team2Index % team2Players.length];
    }
    
    room.currentPlayer = nextDescriber.id;
    room.currentPlayerName = nextDescriber.name;
    room.currentTeam = nextTeamId;

    return {
      success: true,
      score,
      teamId,
      positions: {
        1: room.teams[1].position,
        2: room.teams[2].position
      },
      nextTeam: room.currentTeam,
      nextDescriber: room.currentPlayer,
      nextDescriberName: room.currentPlayerName,
      gameOver,
      winner
    };
  }

  removePlayer(playerId) {
    for (const [roomId, room] of this.rooms.entries()) {
      const playerIndex = room.players.findIndex(p => p.id === playerId);
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);
        
        // If host left, assign new host
        if (room.host === playerId && room.players.length > 0) {
          room.host = room.players[0].id;
        }
        
        // Delete room if empty
        if (room.players.length === 0) {
          this.rooms.delete(roomId);
          return null;
        }
        
        return room;
      }
    }
    return null;
  }
}
