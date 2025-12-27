'use client';

import { useState, useEffect } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import styles from './Lobby.module.css';

export default function Lobby({ onGameStart, onBack }) {
  const { socket, connected } = useSocket();
  const [mode, setMode] = useState(null); // 'create' or 'join'
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [room, setRoom] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!socket) return;

    socket.on('roomUpdated', (updatedRoom) => {
      setRoom(updatedRoom);
    });

    socket.on('gameStarted', (gameRoom) => {
      const player = gameRoom.players.find(p => p.id === socket.id);
      onGameStart(gameRoom, player);
    });

    socket.on('playerLeft', ({ room: updatedRoom }) => {
      setRoom(updatedRoom);
    });

    return () => {
      socket.off('roomUpdated');
      socket.off('gameStarted');
      socket.off('playerLeft');
    };
  }, [socket, onGameStart]);

  const handleCreateRoom = () => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);
    socket.emit('createRoom', playerName, (response) => {
      setLoading(false);
      if (response.success) {
        setRoom(response.room);
        setMode('create');
        setError('');
      } else {
        setError('Failed to create room');
      }
    });
  };

  const handleJoinRoom = () => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!roomCode.trim()) {
      setError('Please enter room code');
      return;
    }

    setLoading(true);
    socket.emit('joinRoom', { 
      roomId: roomCode.toUpperCase(), 
      playerName, 
      teamId: selectedTeam 
    }, (response) => {
      setLoading(false);
      if (response.success) {
        setRoom(response.room);
        setMode('join');
        setError('');
      } else {
        setError(response.error || 'Failed to join room');
      }
    });
  };

  const handleStartGame = () => {
    if (room.players.length < 2) {
      setError('Need at least 2 players to start');
      return;
    }

    const team1 = room.players.filter(p => p.teamId === 1);
    const team2 = room.players.filter(p => p.teamId === 2);

    if (team1.length === 0 || team2.length === 0) {
      setError('Both teams need at least one player');
      return;
    }

    socket.emit('startGame', room.id, (response) => {
      if (!response.success) {
        setError(response.error || 'Failed to start game');
      }
    });
  };

  if (!connected) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Connecting to server...</div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className={styles.container}>
        <button className={styles.backButton} onClick={onBack}>
          ← Back
        </button>

        <div className={styles.card}>
          <h2 className={styles.title}>Join the Game</h2>

          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className={styles.input}
            maxLength={20}
          />

          {mode === null && (
            <div className={styles.modeButtons}>
              <button 
                className={styles.button}
                onClick={() => setMode('create')}
              >
                Create New Room
              </button>
              <button 
                className={styles.button}
                onClick={() => setMode('join')}
              >
                Join Existing Room
              </button>
            </div>
          )}

          {mode === 'create' && (
            <button 
              className={`${styles.button} ${styles.primaryButton}`}
              onClick={handleCreateRoom}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Room'}
            </button>
          )}

          {mode === 'join' && (
            <>
              <input
                type="text"
                placeholder="Enter room code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className={styles.input}
                maxLength={6}
              />
              
              <div className={styles.teamSelector}>
                <label>Select Team:</label>
                <div className={styles.teamButtons}>
                  <button
                    className={`${styles.teamButton} ${selectedTeam === 1 ? styles.team1Active : ''}`}
                    onClick={() => setSelectedTeam(1)}
                    style={{ borderColor: '#FF6B6B' }}
                  >
                    Team 1
                  </button>
                  <button
                    className={`${styles.teamButton} ${selectedTeam === 2 ? styles.team2Active : ''}`}
                    onClick={() => setSelectedTeam(2)}
                    style={{ borderColor: '#4ECDC4' }}
                  >
                    Team 2
                  </button>
                </div>
              </div>

              <button 
                className={`${styles.button} ${styles.primaryButton}`}
                onClick={handleJoinRoom}
                disabled={loading}
              >
                {loading ? 'Joining...' : 'Join Room'}
              </button>
            </>
          )}

          {error && <div className={styles.error}>{error}</div>}
        </div>
      </div>
    );
  }

  const team1Players = room.players.filter(p => p.teamId === 1);
  const team2Players = room.players.filter(p => p.teamId === 2);
  const isHost = socket.id === room.host;

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={onBack}>
        ← Leave Room
      </button>

      <div className={styles.card}>
        <h2 className={styles.title}>Room: {room.id}</h2>
        <p className={styles.subtitle}>Share this code with friends!</p>

        <div className={styles.teamsContainer}>
          <div className={styles.team} style={{ borderColor: '#FF6B6B' }}>
            <h3 style={{ color: '#FF6B6B' }}>Team 1</h3>
            <div className={styles.playerList}>
              {team1Players.length === 0 ? (
                <p className={styles.emptyTeam}>No players yet</p>
              ) : (
                team1Players.map(player => (
                  <div key={player.id} className={styles.player}>
                    {player.name}
                    {player.id === room.host && ' 👑'}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className={styles.team} style={{ borderColor: '#4ECDC4' }}>
            <h3 style={{ color: '#4ECDC4' }}>Team 2</h3>
            <div className={styles.playerList}>
              {team2Players.length === 0 ? (
                <p className={styles.emptyTeam}>No players yet</p>
              ) : (
                team2Players.map(player => (
                  <div key={player.id} className={styles.player}>
                    {player.name}
                    {player.id === room.host && ' 👑'}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {isHost && (
          <button 
            className={`${styles.button} ${styles.primaryButton} ${styles.startButton}`}
            onClick={handleStartGame}
          >
            Start Game
          </button>
        )}

        {!isHost && (
          <p className={styles.waitingText}>Waiting for host to start the game...</p>
        )}

        {error && <div className={styles.error}>{error}</div>}
      </div>
    </div>
  );
}
