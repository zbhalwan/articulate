'use client';

import { useState, useEffect, useRef } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import styles from './Game.module.css';
import GameBoard from '../GameBoard/GameBoard';

export default function Game({ room: initialRoom, player: initialPlayer, onLeave }) {
  const { socket } = useSocket();
  const [room, setRoom] = useState(initialRoom);
  const [player] = useState(initialPlayer);
  const [gameState, setGameState] = useState('waiting'); // waiting, describing, guessing
  const [currentWord, setCurrentWord] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentDescriber, setCurrentDescriber] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [turnScore, setTurnScore] = useState(0);
  const [message, setMessage] = useState('');
  const timerRef = useRef(null);

  const isMyTurn = room.currentPlayer === socket.id;
  const myTeam = player.teamId;
  const isMyTeamTurn = room.currentTeam === myTeam;
  const isMyTurnToDescribe = room.currentPlayer === socket.id;

  useEffect(() => {
    if (!socket) return;

    socket.on('turnStarted', ({ teamId, category, timeRemaining: time, playerName, room: updatedRoom }) => {
      setCurrentCategory(category);
      setTimeRemaining(time);
      setTurnScore(0);
      setCurrentDescriber(playerName);
      
      if (updatedRoom) {
        setRoom(updatedRoom);
      }
      
      const isDescriber = updatedRoom ? updatedRoom.currentPlayer === socket.id : room.currentPlayer === socket.id;
      
      if (isDescriber) {
        setGameState('describing');
      } else if (teamId === player.teamId) {
        setGameState('guessing');
      } else {
        setGameState('waiting');
      }

      // Timer is now driven by server 'timerTick' events
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    });

    // Server-driven timer ticks
    socket.on('timerTick', ({ timeRemaining: t }) => {
      setTimeRemaining(t);
    });

    socket.on('wordReceived', ({ word, category }) => {
      setCurrentWord(word);
      setCurrentCategory(category);
    });

    socket.on('wordGuessed', ({ correct, score }) => {
      setTurnScore(score);
      setMessage(correct ? '✓ Correct!' : '');
      setTimeout(() => setMessage(''), 1000);
    });

    socket.on('turnEnded', ({ score, teamId, positions, nextTeam, nextDescriber, nextDescriberName, gameOver, winner, room: updatedRoom }) => {
      if (timerRef.current) clearInterval(timerRef.current);
      
      // Update room with new positions and next describer
      setRoom(prev => ({
        ...prev,
        teams: {
          ...prev.teams,
          1: { ...prev.teams[1], position: positions[1] },
          2: { ...prev.teams[2], position: positions[2] }
        },
        currentTeam: nextTeam,
        currentPlayer: nextDescriber,
        currentPlayerName: nextDescriberName
      }));
      
      // If we got the full updated room, use it
      if (updatedRoom) {
        setRoom(updatedRoom);
      }

      setGameState('waiting');
      setCurrentWord(null);
      setCurrentCategory(null);
      setCurrentDescriber(nextDescriberName);
      setTimeRemaining(30);
      
      if (gameOver) {
        setMessage(`Team ${winner} wins! 🎉`);
      } else {
        setMessage(`Team ${teamId} scored ${score} point${score !== 1 ? 's' : ''}!`);
        setTimeout(() => setMessage(''), 3000);
      }
    });

    socket.on('gameOver', ({ winner }) => {
      setGameState('finished');
      setMessage(`Team ${winner} wins! 🎉`);
    });

    return () => {
      socket.off('turnStarted');
      socket.off('timerTick');
      socket.off('wordReceived');
      socket.off('wordGuessed');
      socket.off('turnEnded');
      socket.off('gameOver');
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [socket, room, player]);

  const handleStartTurn = () => {
    socket.emit('startTurn', room.id, (response) => {
      if (!response.success) {
        setMessage(response.error);
      }
    });
  };

  const handleCorrect = () => {
    socket.emit('wordCorrect', room.id, (response) => {
      if (!response.success) {
        setMessage(response.error);
      }
    });
  };

  const handleSkip = () => {
    socket.emit('skipWord', room.id, (response) => {
      if (!response.success) {
        setMessage(response.error);
      }
    });
  };

  const handleEndTurn = () => {
    socket.emit('endTurn', room.id, (response) => {
      if (!response.success) {
        setMessage(response.error);
      }
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.leaveButton} onClick={onLeave}>
          ← Leave
        </button>
        <h2 className={styles.roomCode}>Room: {room.id}</h2>
      </div>

      <GameBoard 
        teams={room.teams} 
        boardSize={room.boardSize}
        currentTeam={room.currentTeam}
        boardSpaces={room.boardSpaces}
      />

      <div className={styles.currentDescriberBanner}>
        {currentDescriber && (
          <div className={styles.describerInfo}>
            <span className={styles.describerLabel}>Current Describer:</span>
            <span className={styles.describerName}>{currentDescriber}</span>
            <span className={styles.describerTeam} style={{ 
              backgroundColor: room.teams[room.currentTeam].color 
            }}>
              Team {room.currentTeam}
            </span>
          </div>
        )}
      </div>

      <div className={styles.gameInfo}>
        <div className={styles.timer}>
          <div className={styles.timerCircle} style={{
            background: timeRemaining > 10 ? '#4CAF50' : timeRemaining > 5 ? '#FF9800' : '#F44336'
          }}>
            {timeRemaining}
          </div>
        </div>

        {currentCategory && (
          <div className={styles.category}>
            Category: <strong>{currentCategory}</strong>
          </div>
        )}

        {message && (
          <div className={styles.message}>{message}</div>
        )}
      </div>

      <div className={styles.controls}>
        {gameState === 'waiting' && isMyTurnToDescribe && (
          <button 
            className={`${styles.button} ${styles.startButton}`}
            onClick={handleStartTurn}
          >
            Start Your Turn
          </button>
        )}

        {gameState === 'waiting' && !isMyTurnToDescribe && (
          <div className={styles.waitingText}>
            Waiting for {currentDescriber || `Team ${room.currentTeam}'s describer`} to start their turn...
          </div>
        )}

        {gameState === 'describing' && (
          <div className={styles.describeMode}>
            <div className={styles.wordDisplay}>
              <div className={styles.wordLabel}>Describe this word:</div>
              <div className={styles.word}>{currentWord}</div>
            </div>
            
            <div className={styles.scoreDisplay}>
              Score: {turnScore}
            </div>

            <div className={styles.buttonRow}>
              <button 
                className={`${styles.button} ${styles.correctButton}`}
                onClick={handleCorrect}
              >
                ✓ Correct
              </button>
              <button 
                className={`${styles.button} ${styles.skipButton}`}
                onClick={handleSkip}
              >
                Skip
              </button>
            </div>

            <button 
              className={`${styles.button} ${styles.endButton}`}
              onClick={handleEndTurn}
            >
              End Turn
            </button>

            <div className={styles.rules}>
              <p>🚫 Don't say the word or parts of it!</p>
              <p>🚫 Don't use rhyming words!</p>
            </div>
          </div>
        )}

        {gameState === 'guessing' && (
          <div className={styles.guessMode}>
            <div className={styles.guessingLabel}>
              Your teammate is describing...
            </div>
            <div className={styles.scoreDisplay}>
              Score: {turnScore}
            </div>
            <div className={styles.hint}>
              Listen carefully and shout out your guesses!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
