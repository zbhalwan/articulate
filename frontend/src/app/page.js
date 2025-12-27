'use client';

import { useState } from 'react';
import styles from './page.module.css';
import Lobby from '@/components/Lobby/Lobby';
import Game from '@/components/Game/Game';
import { SocketProvider } from '@/contexts/SocketContext';

export default function Home() {
  const [gameState, setGameState] = useState('home'); // home, lobby, playing
  const [roomData, setRoomData] = useState(null);
  const [playerData, setPlayerData] = useState(null);

  const handleCreateRoom = () => {
    setGameState('lobby');
  };

  const handleJoinRoom = () => {
    setGameState('lobby');
  };

  const handleGameStart = (room, player) => {
    setRoomData(room);
    setPlayerData(player);
    setGameState('playing');
  };

  const handleLeaveGame = () => {
    setGameState('home');
    setRoomData(null);
    setPlayerData(null);
  };

  return (
    <SocketProvider>
      <main className={styles.main}>
        {gameState === 'home' && (
          <div className={styles.homeContainer}>
            <h1 className={styles.title}>Articulate</h1>
            <p className={styles.subtitle}>The Fast Talking Description Game</p>
            
            <div className={styles.buttonContainer}>
              <button 
                className={`${styles.button} ${styles.primaryButton}`}
                onClick={handleCreateRoom}
              >
                Create Room
              </button>
              <button 
                className={`${styles.button} ${styles.secondaryButton}`}
                onClick={handleJoinRoom}
              >
                Join Room
              </button>
            </div>

            <div className={styles.howToPlay}>
              <h2>How to Play</h2>
              <ul>
                <li>Split into 2 teams</li>
                <li>Describe words to your team without saying the word</li>
                <li>Get as many correct in 30 seconds</li>
                <li>Move forward that many spaces on the board</li>
                <li>First team to reach the end wins!</li>
              </ul>
            </div>
          </div>
        )}

        {gameState === 'lobby' && (
          <Lobby onGameStart={handleGameStart} onBack={() => setGameState('home')} />
        )}

        {gameState === 'playing' && (
          <Game 
            room={roomData} 
            player={playerData} 
            onLeave={handleLeaveGame}
          />
        )}
      </main>
    </SocketProvider>
  );
}
