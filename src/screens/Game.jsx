import React, {
  memo,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { gsap } from 'gsap';
import Sprite from '../components/Sprite';
import Fighter from '../components/Fighter';
import {
  damage,
  detectColision,
  determineFrame,
  timer,
  velocityX,
} from '../constants';
import './Game.css';
import * as Character from '../constants/character';

function Game() {
  const canvas = useRef(null);
  const requestRef = useRef();
  const playerBarRef = useRef();
  const playerTwoBarRef = useRef();

  const [UIText, setUIText] = useState('');
  const [gameEnd, setGameEnd] = useState(false);
  const [gameTimer, setGameTimer] = useState(timer);
  const [background, setBackground] = useState(null);
  const [shop, setShop] = useState(null);

  const [context, setContex] = useState(null);
  const [player, setPlayer] = useState(null);
  const [playerTwo, setPlayerTwo] = useState(null);

  const [lastKey, setLastKey] = useState(null);
  const [lastKeyToPlayerTwo, setLastKeyToPlayerTwo] = useState(null);

  const [playerLife, setPlayerLife] = useState(100);
  const [aIsPress, setAIsPress] = useState(false);
  const [dIsPress, setDIsPress] = useState(false);
  const [playerIsAttacking, setPlayerIsAttacking] = useState(false);

  const [playerTwoLife, setPlayerTwoLife] = useState(100);
  const [arrowRightIsPress, setArrowRightIsPress] = useState(false);
  const [arrowLeftIsPress, setArrowLeftIsPressBtn] = useState(false);
  const [playerTwoIsAttacking, setPlayerTwoIsAttacking] = useState(false);

  const animate = () => {
    if (gameEnd) {
      const victory = playerLife > playerTwoLife ? 0 : 1;
      setUIText((victory && 'Player 2 wins') || 'Player 1 wins');
      if (victory) player.switchSprites('death');
      else playerTwo.switchSprites('death');
    }

    requestRef.current = requestAnimationFrame(animate);

    if (context) {
      context.fillStyle = 'black';
      context.fillRect(0, 0, canvas.current.width, canvas.current.height);
      background.update({ context });
      console.log(shop.update);
      context.fillStyle = 'rgba(255, 255, 255, 0.45)';
      context.fillRect(0, 0, canvas.current.width, canvas.current.height);

      player.update({
        context,
        canvas,
        attack: playerIsAttacking,
      });
      playerTwo.update({
        context,
        canvas,
        attack: playerTwoIsAttacking,
      });

      if (!player.dead) {
        if (aIsPress && lastKey === 'a') {
          player.velocity.x = -velocityX;
          if (player.velocity.x < 0) player.flipX = true;
          player.switchSprites('run');
        } else if (dIsPress && lastKey === 'd') {
          player.velocity.x = velocityX;
          if (player.velocity.x > 0) player.flipX = false;
          player.switchSprites('run');
        } else {
          player.velocity.x = 0;
          player.switchSprites('idle');
        }

        if (player.velocity.y < 0) player.switchSprites('jump');
        else if (player.velocity.y > 0) player.switchSprites('fall');
      }

      if (!playerTwo.dead) {
        if (arrowLeftIsPress && lastKeyToPlayerTwo === 'ArrowLeft') {
          playerTwo.velocity.x = -velocityX;
          playerTwo.switchSprites('run');
        } else if (arrowRightIsPress && lastKeyToPlayerTwo === 'ArrowRight') {
          playerTwo.velocity.x = velocityX;
          playerTwo.switchSprites('run');
        } else {
          playerTwo.velocity.x = 0;
          playerTwo.switchSprites('idle');
        }

        if (playerTwo.velocity.y < 0) playerTwo.switchSprites('jump');
        else if (playerTwo.velocity.y > 0) playerTwo.switchSprites('fall');
      }

      //detect colision

      if (
        detectColision({ colisor: player, colisorTwo: playerTwo }) &&
        playerIsAttacking &&
        player.framesCurrent === determineFrame(player)
      ) {
        console.log('go player');
        setPlayerIsAttacking(false);
        setPlayerTwoLife((v) => {
          playerTwo.switchSprites('takeHit');
          if (v === damage) setGameEnd(true);
          return v > damage ? v - damage : 0;
        });
      }

      if (
        detectColision({ colisor: playerTwo, colisorTwo: player }) &&
        playerTwoIsAttacking &&
        playerTwo.framesCurrent === determineFrame(playerTwo)
      ) {
        console.log('go player two');
        setPlayerTwoIsAttacking(false);
        setPlayerLife((v) => {
          player.switchSprites('takeHit');
          if (v === damage) setGameEnd(true);
          return v > damage ? v - damage : 0;
        });
      }

      if (player.framesCurrent === determineFrame(player) && playerIsAttacking)
        setPlayerIsAttacking(false);

      if (
        playerTwo.framesCurrent === determineFrame(playerTwo) &&
        playerTwoIsAttacking
      )
        setPlayerTwoIsAttacking(false);
    }
  };

  useEffect(() => {
    setContex(canvas.current.getContext('2d'));
    setBackground(
      new Sprite({
        position: { x: 0, y: 0 },
        imageSrc: './assets/images/backgroundF.png',
      }),
    );
    setShop(
      new Sprite({
        scale: 2.75,
        position: { x: 600, y: 128 },
        imageSrc: './assets/images/shop.png',
        framesMax: 6,
      }),
    );
    setPlayer(
      new Fighter({ ...Character.thunderWarrior, position: { x: 50, y: 0 } }),
    );
    setPlayerTwo(
      new Fighter({
        ...Character.samurai,
        position: { x: 888, y: 0 },
      }),
    );
  }, [canvas]);

  useEffect(() => {
    canvas.current.width = 1024;
    canvas.current.height = 576;
    context?.fillRect(0, 0, canvas.current.width, canvas.current.height);

    if (context) {
      player?.draw(context);
      playerTwo?.draw(context);
    }
  }, [context, player, playerTwo]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  });

  useEffect(() => console.log(player), [player]);

  useLayoutEffect(() => {
    if (typeof playerLife === 'number' && typeof playerTwoLife === 'number') {
      if (playerLife === 0) gsap.to(playerBarRef.current, { width: '0%' });
      else gsap.to(playerBarRef.current, { width: playerLife + '%' });
      if (playerTwoLife === 0)
        gsap.to(playerTwoBarRef.current, { width: '0%' });
      else gsap.to(playerTwoBarRef.current, { width: playerTwoLife + '%' });
    }
  }, [playerLife, playerTwoLife]);

  useEffect(() => {
    const func = setInterval(() => {
      if (gameEnd) return;
      setGameTimer((v) => (v > 0 ? v - 1 : v));
      if (gameTimer === 0) {
        if (playerLife > 0 && playerTwoLife > 0) setUIText('Draw');
      }
    }, 1000);

    return () => clearInterval(func);
  }, [gameEnd, gameTimer, playerLife, playerTwoLife]);

  useEffect(() => {
    const func = (e) => {
      switch (e.key) {
        case 'd':
          setDIsPress(true);
          setAIsPress(false);
          setLastKey('d');
          break;
        case 'a':
          setAIsPress(true);
          setDIsPress(false);
          setLastKey('a');
          break;
        case 'w':
          if (!player.dead) player.velocity.y = -15;
          break;

        //Player 2

        case 'ArrowRight':
          setArrowRightIsPress(true);
          setLastKeyToPlayerTwo('ArrowRight');
          break;
        case 'ArrowLeft':
          setArrowLeftIsPressBtn(true);
          setLastKeyToPlayerTwo('ArrowLeft');
          break;
        case 'ArrowUp':
          if (!playerTwo.dead) playerTwo.velocity.y = -15;
          break;

        case ' ':
          setPlayerIsAttacking(true);
          break;
        case 'Enter':
          setPlayerTwoIsAttacking(true);
          break;

        default:
          console.log(e.key);
      }
    };

    const funcClose = (e) => {
      switch (e.key) {
        case 'd':
          setDIsPress(false);
          break;
        case 'a':
          setAIsPress(false);
          break;
        case 'w':
          break;

        case 'ArrowRight':
          setArrowRightIsPress(false);
          break;
        case 'ArrowLeft':
          setArrowLeftIsPressBtn(false);
          break;
        case 'ArrowUp':
          break;
      }
    };

    window.addEventListener('keydown', func);
    window.addEventListener('keyup', funcClose);

    return () => {
      window.removeEventListener('keydown', func);
      window.removeEventListener('keyup', funcClose);
    };
  }, [player, playerTwo]);

  return (
    <div className="id-root">
      <div id="container">
        <div className="container-info">
          {/* Player life */}
          <div className="player-life">
            <div ref={playerBarRef} className="player-bar"></div>
          </div>
          {/* Timer */}
          <div className="timer">{gameTimer}</div>
          {/* PlayerTwo life */}
          <div className="player-two-life">
            <div ref={playerTwoBarRef} className="player-two-bar"></div>
          </div>
        </div>
        <div className="result">{UIText}</div>
        <canvas ref={canvas}></canvas>
      </div>
    </div>
  );
}

export default memo(Game);
