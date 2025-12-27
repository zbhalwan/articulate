'use client';

import styles from './GameBoard.module.css';

export default function GameBoard({ teams, boardSize, currentTeam, boardSpaces }) {
  if (!boardSpaces || boardSpaces.length === 0) {
    return <div className={styles.loading}>Loading board...</div>;
  }

  return (
    <div className={styles.boardContainer}>
      <div className={styles.board}>
        {boardSpaces.map((space, index) => {
          const team1Here = teams[1].position === space.index;
          const team2Here = teams[2].position === space.index;
          
          return (
            <div
              key={space.index}
              className={`${styles.space} ${space.category === 'FINISH' ? styles.finishSpace : ''} ${space.category === 'START' ? styles.startSpace : ''}`}
              style={{
                backgroundColor: space.color,
              }}
            >
              <div className={styles.spaceLabel}>{space.label}</div>
              <div className={styles.spaceNumber}>{space.index + 1}</div>
              
              <div className={styles.teamMarkers}>
                {team1Here && (
                  <div 
                    className={`${styles.teamMarker} ${styles.team1Marker}`}
                    style={{ backgroundColor: teams[1].color }}
                  >
                    T1
                  </div>
                )}
                
                {team2Here && (
                  <div 
                    className={`${styles.teamMarker} ${styles.team2Marker}`}
                    style={{ backgroundColor: teams[2].color }}
                  >
                    T2
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Team info cards */}
      <div className={styles.teamInfo}>
        <div className={`${styles.teamCard} ${currentTeam === 1 ? styles.activeTeam : ''}`} style={{ borderColor: teams[1].color }}>
          <div className={styles.teamHeader} style={{ backgroundColor: teams[1].color }}>
            <span>Team 1</span>
            {currentTeam === 1 && <span className={styles.turnBadge}>TURN</span>}
          </div>
          <div className={styles.teamScore}>
            Position: {teams[1].position + 1}/{boardSize}
          </div>
          <div className={styles.playerList}>
            {teams[1].playerNames && teams[1].playerNames.map((name, idx) => (
              <div key={idx} className={styles.playerName}>{name}</div>
            ))}
          </div>
        </div>

        <div className={`${styles.teamCard} ${currentTeam === 2 ? styles.activeTeam : ''}`} style={{ borderColor: teams[2].color }}>
          <div className={styles.teamHeader} style={{ backgroundColor: teams[2].color }}>
            <span>Team 2</span>
            {currentTeam === 2 && <span className={styles.turnBadge}>TURN</span>}
          </div>
          <div className={styles.teamScore}>
            Position: {teams[2].position + 1}/{boardSize}
          </div>
          <div className={styles.playerList}>
            {teams[2].playerNames && teams[2].playerNames.map((name, idx) => (
              <div key={idx} className={styles.playerName}>{name}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
