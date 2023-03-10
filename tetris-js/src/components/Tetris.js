import React, { useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { createStage, checkCollision } from '../gameHelpers';
import { StyledTetrisWrapper, StyledTetris } from './styles/StyledTetris';

// Custom Hooks
import { useInterval } from '../hooks/useInterval';
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';
import { useGameStatus } from '../hooks/useGameStatus';

// Components
import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton';
import Leaderboard from './styles/StyledLeaderBoard';

const Tetris = ({logOut, user}) => {
  const [dropTime, setDropTime] = useState(null);
  const [gameOver, setGameOver] = useState(false);
	const [HighScore, setHighScore] = useState(0);

  const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
  const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
  const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(
    rowsCleared
  );
  const movePlayer = dir => {
    if (!checkCollision(player, stage, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0 });
    }
  };

  const keyUp = ({ keyCode }) => {
    if (!gameOver) {
      // Activate the interval again when user releases down arrow.
      if (keyCode === 40) {
        setDropTime(1000 / (level + 1));
      }
      if (keyCode === 83) {
        setDropTime(1000 / (level + 1));
      }
    }
  };

  const startGame = () => {
    // Reset everything
    setStage(createStage());
    setDropTime(1000);
    resetPlayer();
		if(score !== 0 && score > HighScore){
			setHighScore(score);
		}
    setScore(0);
    setLevel(0);
    setRows(0);
    setGameOver(false);
    
  };

  const drop = () => {
    // Increase level when player has cleared 10 rows
    if (rows > (level + 1) * 10) {
      setLevel(prev => prev + 1);
      // Also increase speed
      setDropTime(1000 / (level + 1) + 200);
    }

    if (!checkCollision(player, stage, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false });
    } else {
      // Game over!
      if (player.pos.y < 1) {
        setGameOver(true);
        setDropTime(null);
      }
      updatePlayerPos({ x: 0, y: 0, collided: true });
    }
  };

  const dropPlayer = () => {
    // We don't need to run the interval when we use the arrow down to
    // move the tetromino downwards. So deactivate it for now.
    setDropTime(null);
    drop();
  };

  // This one starts the game
  // Custom hook by Dan Abramov
  useInterval(() => {
    drop();
  }, dropTime);

  const move = ({ keyCode }) => {
    if (!gameOver) {
      if (keyCode === 37) {
        movePlayer(-1);
      } else if (keyCode === 39) {
        movePlayer(1);
      } else if (keyCode === 40) {
        dropPlayer();
      } else if (keyCode === 38) {
        playerRotate(stage, 1);
      }else if (keyCode === 65) {
        movePlayer(-1);
      }else if (keyCode === 68) {
        movePlayer(1);
      } else if (keyCode === 83) {
        dropPlayer();
      } else if (keyCode === 87) {
        playerRotate(stage, 1);
      }
    }
  };
  const handleGetHighScore = () => {
    const db = firebase.firestore();
    const userRef = db.collection('players').where('UserId', '==', user.uid);
    userRef.get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        setHighScore(doc.data().Score);
      });
    })
    .catch(error => {
      console.error(error);
    });
  };
  const highScore = localStorage.getItem("highScore");
  if (highScore) {
    setHighScore(highScore);
  } else {
    handleGetHighScore();
  }
  

  return (
    <StyledTetrisWrapper
      role="button"
      tabIndex="0"
      onKeyDown={e => move(e)}
      onKeyUp={keyUp}
    >
      <StyledTetris>
        <Stage stage={stage} />
        <aside>
          {gameOver ? (
            <Display gameOver={gameOver} text="Game Over" />
          ) : (
            <div>
              <button onClick={logOut}>LogOut</button>
              <Display text ={`Logged in as ${user.displayName}`}/>
							<Display text={`HighScore: ${HighScore}`} />
              <Display text={`Score: ${score}`} />
              <Display text={`rows: ${rows}`} />
              <Display text={`Level: ${level}`} />
              <Display text={`Controls: W-Rotate Block |A-left | S-down | D-right |`} />
            </div>
          )}
          <StartButton callback={startGame} />
        </aside>
        <aside>
          <Leaderboard user={user} HighScore={HighScore}/>
        </aside>
      </StyledTetris>
    </StyledTetrisWrapper>
  );
};

export default Tetris;