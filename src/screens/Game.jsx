import React, { memo, useEffect, useRef, useState } from 'react';
import Sprite from '../components/Sprite';
import { velocityX } from '../constants';
import './Game.css';

function Game() {
  const canvas = useRef(null);
  const requestRef = useRef();
  const [context, setContex] = useState(null);
  const [player, setPlayer] = useState(null);
  const [playerTwo, setPlayerTwo] = useState(null);

  const [lastKey, setLastKey] = useState(null);
  const [lastKeyToPlayerTwo, setLastKeyToPlayerTwo] = useState(null);
  const [aIsPress, setAIsPress] = useState(false);
  const [dIsPress, setDIsPress] = useState(false);

  const [arrowRightIsPress, setArrowRightIsPress] = useState(false);
  const [arrowLeftIsPress, setArrowLeftIsPressBtn] = useState(false);

  const animate = () => {
    requestRef.current = requestAnimationFrame(animate);
    console.log('oia');

    if (context) {
      context.fillStyle = 'black';
      context.fillRect(0, 0, canvas.current.width, canvas.current.height);
      player.update(context, canvas);
      playerTwo.update(context, canvas);

      if (aIsPress && lastKey === 'a') player.velocity.x = -velocityX;
      else if (dIsPress && lastKey === 'd') player.velocity.x = velocityX;
      else player.velocity.x = 0;

      if (arrowLeftIsPress && lastKeyToPlayerTwo === 'ArrowLeft')
        playerTwo.velocity.x = -velocityX;
      else if (arrowRightIsPress && lastKeyToPlayerTwo === 'ArrowRight')
        playerTwo.velocity.x = velocityX;
      else playerTwo.velocity.x = 0;
    }
  };

  useEffect(() => {
    setContex(canvas.current.getContext('2d'));
    setPlayer(
      new Sprite({ position: { x: 0, y: 0 }, velocity: { x: 0, y: 2 } }),
    );
    setPlayerTwo(
      new Sprite({ position: { x: 400, y: 100 }, velocity: { x: 0, y: 0 } }),
    );
  }, [canvas]);

  useEffect(() => {
    canvas.current.width = window.screen.width / 2;
    canvas.current.height = window.screen.height / 2;
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

  useEffect(() => {
    const func = (e) => {
      switch (e.key) {
        case 'd':
          setDIsPress(true);
          setLastKey('d');
          break;
        case 'a':
          setAIsPress(true);
          setLastKey('a');
          break;
        case 'w':
          player.velocity.y = -10;
          break;

        case 'ArrowRight':
          setArrowRightIsPress(true);
          setLastKeyToPlayerTwo('ArrowRight');
          break;
        case 'ArrowLeft':
          setArrowLeftIsPressBtn(true);
          setLastKeyToPlayerTwo('ArrowLeft');
          break;
        case 'ArrowUp':
          playerTwo.velocity.y = -10;
          break;
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
  }, [player.velocity, playerTwo.velocity]);

  return (
    <div className="id-root">
      <canvas ref={canvas}></canvas>
    </div>
  );
}

export default memo(Game);
