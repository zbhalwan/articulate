import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { GameManager } from './game/GameManager.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

const gameManager = new GameManager();
// Map to track active timers per room: { intervalId, remaining }
const roomTimers = new Map();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Create a new game room
  socket.on('createRoom', (playerName, callback) => {
    const room = gameManager.createRoom(socket.id, playerName);
    socket.join(room.id);
    callback({ success: true, room });
  });

  // Join an existing room
  socket.on('joinRoom', ({ roomId, playerName, teamId }, callback) => {
    const result = gameManager.joinRoom(roomId, socket.id, playerName, teamId);
    if (result.success) {
      socket.join(roomId);
      io.to(roomId).emit('roomUpdated', result.room);
      callback({ success: true, room: result.room });
    } else {
      callback({ success: false, error: result.error });
    }
  });

  // Start the game
  socket.on('startGame', (roomId, callback) => {
    const result = gameManager.startGame(roomId, socket.id);
    if (result.success) {
      io.to(roomId).emit('gameStarted', result.room);
      callback({ success: true });
    } else {
      callback({ success: false, error: result.error });
    }
  });

  // Get next word/category
  socket.on('startTurn', (roomId, callback) => {
    const result = gameManager.startTurn(roomId, socket.id);
    if (result.success) {
      // Send word only to the describing player
      socket.emit('wordReceived', { 
        word: result.word, 
        category: result.category 
      });
      // Notify room that turn started
      const room = gameManager.rooms.get(roomId);
      io.to(roomId).emit('turnStarted', {
        teamId: result.teamId,
        playerId: socket.id,
        playerName: result.playerName,
        category: result.category,
        timeRemaining: 30,
        room: room
      });
      // Clear any existing timer for this room
      if (roomTimers.has(roomId)) {
        const existing = roomTimers.get(roomId);
        clearInterval(existing.intervalId);
        roomTimers.delete(roomId);
      }

      // Start countdown for the turn (30 seconds)
      let remaining = 30;
      const intervalId = setInterval(() => {
        remaining -= 1;
        // Emit tick to clients in room
        io.to(roomId).emit('timerTick', { timeRemaining: remaining });

        if (remaining <= 0) {
          // Time's up: clear timer and end the turn automatically
          clearInterval(intervalId);
          roomTimers.delete(roomId);

          const room = gameManager.rooms.get(roomId);
          // Safely call endTurn using the room's current player
          const endResult = gameManager.endTurn(roomId, room ? room.currentPlayer : socket.id);
          if (endResult.success) {
            const updatedRoom = gameManager.rooms.get(roomId);
            io.to(roomId).emit('turnEnded', {
              score: endResult.score,
              teamId: endResult.teamId,
              positions: endResult.positions,
              nextTeam: endResult.nextTeam,
              nextDescriber: endResult.nextDescriber,
              nextDescriberName: endResult.nextDescriberName,
              gameOver: endResult.gameOver,
              winner: endResult.winner,
              room: updatedRoom
            });

            if (endResult.gameOver) {
              io.to(roomId).emit('gameOver', { winner: endResult.winner });
            }
          }
        }
      }, 1000);

      // Store timer info for potential clearing later
      roomTimers.set(roomId, { intervalId, remaining: () => remaining });
      callback({ success: true });
    } else {
      callback({ success: false, error: result.error });
    }
  });

  // Word guessed correctly
  socket.on('wordCorrect', (roomId, callback) => {
    const result = gameManager.wordCorrect(roomId, socket.id);
    if (result.success) {
      io.to(roomId).emit('wordGuessed', {
        correct: true,
        score: result.score,
        teamId: result.teamId
      });
      
      // Send next word to describer
      const nextWord = gameManager.getNextWord(roomId);
      socket.emit('wordReceived', { 
        word: nextWord.word, 
        category: nextWord.category 
      });
      
      callback({ success: true });
    } else {
      callback({ success: false, error: result.error });
    }
  });

  // Skip word
  socket.on('skipWord', (roomId, callback) => {
    const result = gameManager.skipWord(roomId, socket.id);
    if (result.success) {
      // Send next word to describer
      const nextWord = gameManager.getNextWord(roomId);
      socket.emit('wordReceived', { 
        word: nextWord.word, 
        category: nextWord.category 
      });
      callback({ success: true });
    } else {
      callback({ success: false, error: result.error });
    }
  });

  // End turn
  socket.on('endTurn', (roomId, callback) => {
    const result = gameManager.endTurn(roomId, socket.id);
    if (result.success) {
      const room = gameManager.rooms.get(roomId);
      // Clear any active timer for this room
      if (roomTimers.has(roomId)) {
        const t = roomTimers.get(roomId);
        clearInterval(t.intervalId);
        roomTimers.delete(roomId);
      }

      io.to(roomId).emit('turnEnded', {
        score: result.score,
        teamId: result.teamId,
        positions: result.positions,
        nextTeam: result.nextTeam,
        nextDescriber: result.nextDescriber,
        nextDescriberName: result.nextDescriberName,
        gameOver: result.gameOver,
        winner: result.winner,
        room: room
      });
      
      if (result.gameOver) {
        io.to(roomId).emit('gameOver', { winner: result.winner });
      }
      
      callback({ success: true });
    } else {
      callback({ success: false, error: result.error });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    const room = gameManager.removePlayer(socket.id);
    if (room) {
      io.to(room.id).emit('playerLeft', { room });
    }
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
