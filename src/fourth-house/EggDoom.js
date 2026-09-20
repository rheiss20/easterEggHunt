import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import eggPopSoundFile from '../sounds/pop1.mp3';
import congratulationsSoundFile from '../sounds/congratulations2.mp3';

const LEVELS = [
  {
    name: 'The Burrows',
    world: [
      '111111111111',
      '100000000001',
      '101110111101',
      '100010000001',
      '111010101101',
      '100000101001',
      '101110001001',
      '100011101001',
      '101000001001',
      '101011111001',
      '100000000001',
      '111111111111',
    ],
    enemies: [[9.5, 1.5], [5.5, 3.5], [9.5, 5.5], [2.5, 7.5], [7.5, 8.5], [10.2, 10.2], [4.5, 10.2], [10.5, 7.5], [6.5, 8.5], [10.5, 3.5]],
  },
  {
    name: 'Crosshatch',
    world: [
      '111111111111',
      '100000100001',
      '101110101101',
      '100010100001',
      '101010111101',
      '101000000001',
      '101111101101',
      '100000100001',
      '111010101101',
      '100010000001',
      '100000111001',
      '111111111111',
    ],
    enemies: [[10.5, 1.5], [10.5, 2.5], [3.5, 5.5], [8.5, 5.5], [2.5, 7.5], [9.5, 9.5], [5.5, 10.5], [1.5, 9.5], [6.5, 5.5], [10.5, 7.5]],
  },
  {
    name: 'Spiral',
    world: [
      '111111111111',
      '100000000001',
      '101111111101',
      '101000000101',
      '101011110101',
      '101010010101',
      '101010010101',
      '101011110101',
      '101000000101',
      '101111111101',
      '100000000001',
      '111111111111',
    ],
    enemies: [[8.5, 1.5], [10.5, 4.5], [8.5, 8.5], [3.5, 8.5], [6.5, 1.5], [8.5, 7.5], [2.5, 10.5], [6.5, 3.5], [1.5, 6.5], [9.5, 10.5]],
  },
  {
    name: 'Split House',
    world: [
      '111111111111',
      '100001000001',
      '101001011101',
      '101000000001',
      '101111010101',
      '100000010101',
      '111011110101',
      '100010000101',
      '101010111101',
      '101000000001',
      '100011100001',
      '111111111111',
    ],
    enemies: [[6.5, 1.5], [7.5, 1.5], [6.5, 3.5], [2.5, 5.5], [8.5, 6.5], [5.5, 9.5], [9.5, 10.5], [1.5, 8.5], [10.5, 3.5], [3.5, 10.5]],
  },
  {
    name: 'The Gallery',
    world: [
      '111111111111',
      '100000000001',
      '101011011101',
      '101000010001',
      '101110010101',
      '100010000101',
      '111010111101',
      '100010100001',
      '101110101101',
      '100000100001',
      '100000000001',
      '111111111111',
    ],
    enemies: [[6.5, 1.5], [9.5, 3.5], [5.5, 5.5], [2.5, 7.5], [8.5, 7.5], [4.5, 9.5], [9.5, 10.5], [1.5, 9.5], [3.5, 5.5], [6.5, 10.5]],
  },
];

const FOV = Math.PI / 3;
const TAU = Math.PI * 2;
const eggPopSound = new Audio(eggPopSoundFile);
const congratulationsSound = new Audio(congratulationsSoundFile);
const GAME_OVER_MESSAGES = [
  'YOU ARE COOKED',
  'WHAT THE SHELL??',
  'TAKE ANOTHER CRACK AT IT',
  'OVER? EASY!',
  'YOU ARE DISAPPOINTING',
];

const pickRandomLevel = (excludedLevel) => {
  const choices = excludedLevel
    ? LEVELS.filter((level) => level !== excludedLevel)
    : LEVELS;
  return choices[Math.floor(Math.random() * choices.length)];
};

const pickGameOverMessage = () =>
  GAME_OVER_MESSAGES[Math.floor(Math.random() * GAME_OVER_MESSAGES.length)];

const createEnemies = (enemyStarts) =>
  enemyStarts.map(([x, y], index) => ({
    id: index,
    x,
    y,
    alive: true,
    attackAt: 0,
    phase: index * 0.9,
  }));

const normalizeAngle = (angle) => {
  let normalized = angle;
  while (normalized > Math.PI) normalized -= TAU;
  while (normalized < -Math.PI) normalized += TAU;
  return normalized;
};

const isOpen = (world, x, y) => {
  const row = world[Math.floor(y)];
  return Boolean(row && row[Math.floor(x)] === '0');
};

const canOccupy = (world, x, y) =>
  isOpen(world, x - 0.18, y - 0.18) &&
  isOpen(world, x + 0.18, y - 0.18) &&
  isOpen(world, x - 0.18, y + 0.18) &&
  isOpen(world, x + 0.18, y + 0.18);

const castRay = (world, x, y, angle, maxDistance = 18) => {
  const step = 0.025;
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);
  let distance = 0;

  while (distance < maxDistance) {
    distance += step;
    if (!isOpen(world, x + cosine * distance, y + sine * distance)) {
      return distance;
    }
  }
  return maxDistance;
};

const playTone = (frequency, duration, type = 'square', volume = 0.035) => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const context = new AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, context.currentTime);
  gain.gain.setValueAtTime(volume, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + duration);
  oscillator.onended = () => context.close();
};

const drawEgg = (context, image, x, y, size, phase, attacking) => {
  context.save();
  context.translate(x, y + Math.sin(phase) * size * 0.035);
  if (attacking) {
    context.shadowColor = '#ff1c0a';
    context.shadowBlur = size * 0.28;
  }

  if (image.complete && image.naturalWidth) {
    context.drawImage(image, -size * 0.37, -size * 0.5, size * 0.74, size);
  }
  context.restore();
};

const drawRuneStar = (context, x, y, size) => {
  const outerRadius = size * 0.35;
  const innerRadius = outerRadius * 0.46;
  context.save();
  context.translate(x, y);
  context.beginPath();
  for (let point = 0; point < 10; point += 1) {
    const radius = point % 2 === 0 ? outerRadius : innerRadius;
    const angle = -Math.PI / 2 + (point * Math.PI) / 5;
    const pointX = Math.cos(angle) * radius;
    const pointY = Math.sin(angle) * radius;
    if (point === 0) context.moveTo(pointX, pointY);
    else context.lineTo(pointX, pointY);
  }
  context.closePath();
  context.fillStyle = '#f7bea0';
  context.fill();
  context.lineWidth = Math.max(2, size * 0.025);
  context.strokeStyle = '#160b08';
  context.stroke();
  context.fillStyle = '#32130e';
  context.font = `bold ${Math.max(14, size * 0.28)}px serif`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText('ᛟ', 0, size * 0.015);
  context.restore();
};

export function EggDoom({ onWin }) {
  const canvasRef = useRef(null);
  const eggSpriteRef = useRef(null);
  const keysRef = useRef({});
  const renderFrameRef = useRef(null);
  const levelRef = useRef(pickRandomLevel());
  const playerRef = useRef({ x: 1.6, y: 1.6, angle: 0.05, health: 100, ammo: 20, score: 0 });
  const enemiesRef = useRef(createEnemies(levelRef.current.enemies));
  const lastFrameRef = useRef(0);
  const gameStateRef = useRef('playing');
  const [hud, setHud] = useState({ health: 100, ammo: 20, score: 0 });
  const [gameState, setGameState] = useState('playing');
  const [jumpScare, setJumpScare] = useState(false);
  const [levelName, setLevelName] = useState(levelRef.current.name);
  const [gameOverMessage, setGameOverMessage] = useState(
    pickGameOverMessage,
  );
  const spawnProtectedUntilRef = useRef(window.performance.now() + 3000);

  if (!eggSpriteRef.current) {
    const eggSprite = new window.Image();
    eggSprite.src = 'EggSprite.png';
    eggSprite.onload = () => {
      if (renderFrameRef.current) {
        renderFrameRef.current(window.performance.now());
      }
    };
    eggSpriteRef.current = eggSprite;
  }

  const syncHud = () => {
    const player = playerRef.current;
    setHud({ health: player.health, ammo: player.ammo, score: player.score });
  };

  const setMovement = (key, active) => {
    keysRef.current[key] = active;
    if (renderFrameRef.current) {
      renderFrameRef.current(window.performance.now());
    }
  };

  const restart = () => {
    if (gameStateRef.current === 'lost') {
      levelRef.current = pickRandomLevel(levelRef.current);
      setLevelName(levelRef.current.name);
    }
    playerRef.current = { x: 1.6, y: 1.6, angle: 0.05, health: 100, ammo: 20, score: 0 };
    enemiesRef.current = createEnemies(levelRef.current.enemies);
    spawnProtectedUntilRef.current = window.performance.now() + 3000;
    setGameOverMessage(pickGameOverMessage());
    gameStateRef.current = 'playing';
    setGameState('playing');
    setJumpScare(false);
    syncHud();
  };

  const shoot = () => {
    if (gameStateRef.current !== 'playing') return;
    const player = playerRef.current;
    const { world, enemies: enemyStarts } = levelRef.current;
    if (player.ammo <= 0) {
      playTone(95, 0.08, 'square', 0.02);
      return;
    }

    player.ammo -= 1;
    playTone(85, 0.12, 'sawtooth', 0.06);
    const wallDistance = castRay(world, player.x, player.y, player.angle);
    const target = enemiesRef.current
      .filter((enemy) => enemy.alive)
      .map((enemy) => {
        const dx = enemy.x - player.x;
        const dy = enemy.y - player.y;
        const distance = Math.hypot(dx, dy);
        const angleDifference = Math.abs(
          normalizeAngle(Math.atan2(dy, dx) - player.angle),
        );
        return { enemy, distance, angleDifference };
      })
      .filter(
        ({ distance, angleDifference }) =>
          distance < wallDistance + 0.15 &&
          angleDifference < Math.max(0.055, 0.32 / distance),
      )
      .sort((left, right) => left.distance - right.distance)[0];

    if (target) {
      target.enemy.alive = false;
      player.score += 1;
      eggPopSound.currentTime = 0;
      eggPopSound.play();
      if (player.score === enemyStarts.length) {
        congratulationsSound.currentTime = 0;
        congratulationsSound.play();
        gameStateRef.current = 'won';
        setGameState('won');
        onWin();
      }
    }
    syncHud();
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      keysRef.current[event.key.toLowerCase()] = true;
      if (event.code === 'Space') {
        event.preventDefault();
        shoot();
      }
      if (renderFrameRef.current) {
        renderFrameRef.current(window.performance.now());
      }
    };
    const onKeyUp = (event) => {
      keysRef.current[event.key.toLowerCase()] = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = 640;
    canvas.height = 360;

    const render = (time) => {
      const delta = Math.min(0.04, (time - lastFrameRef.current) / 1000 || 0);
      lastFrameRef.current = time;
      const player = playerRef.current;
      const { world } = levelRef.current;
      const keys = keysRef.current;

      if (gameStateRef.current === 'playing') {
        const turn = ((keys.arrowright || keys.d ? 1 : 0) - (keys.arrowleft || keys.a ? 1 : 0)) * delta * 2.1;
        player.angle = normalizeAngle(player.angle + turn);
        const movement = ((keys.arrowup || keys.w ? 1 : 0) - (keys.arrowdown || keys.s ? 1 : 0)) * delta * 2.15;
        const nextX = player.x + Math.cos(player.angle) * movement;
        const nextY = player.y + Math.sin(player.angle) * movement;
        if (canOccupy(world, nextX, player.y)) player.x = nextX;
        if (canOccupy(world, player.x, nextY)) player.y = nextY;

        enemiesRef.current.forEach((enemy) => {
          if (!enemy.alive) return;
          const dx = player.x - enemy.x;
          const dy = player.y - enemy.y;
          const distance = Math.hypot(dx, dy);
          if (
            time >= spawnProtectedUntilRef.current &&
            distance < 7.5 &&
            distance > 0.54
          ) {
            const speed = delta * (distance < 2.2 ? 0.88 : 0.58);
            const nextEnemyX = enemy.x + (dx / distance) * speed;
            const nextEnemyY = enemy.y + (dy / distance) * speed;
            if (canOccupy(world, nextEnemyX, enemy.y)) enemy.x = nextEnemyX;
            if (canOccupy(world, enemy.x, nextEnemyY)) enemy.y = nextEnemyY;
          }
          if (
            time >= spawnProtectedUntilRef.current &&
            distance < 0.62 &&
            time > enemy.attackAt
          ) {
            enemy.attackAt = time + 1250;
            player.health = Math.max(0, player.health - 20);
            setJumpScare(true);
            playTone(44, 0.45, 'sawtooth', 0.09);
            window.setTimeout(() => setJumpScare(false), 420);
            syncHud();
            if (player.health === 0) {
              gameStateRef.current = 'lost';
              setGameState('lost');
            }
          }
        });
      }

      const width = canvas.width;
      const height = canvas.height;
      const horizon = height * 0.48;
      const sky = context.createLinearGradient(0, 0, 0, horizon);
      sky.addColorStop(0, '#130f18');
      sky.addColorStop(1, '#4b3541');
      context.fillStyle = sky;
      context.fillRect(0, 0, width, horizon);
      const floor = context.createLinearGradient(0, horizon, 0, height);
      floor.addColorStop(0, '#3b332e');
      floor.addColorStop(1, '#100e0d');
      context.fillStyle = floor;
      context.fillRect(0, horizon, width, height - horizon);

      const zBuffer = [];
      for (let column = 0; column < width; column += 2) {
        const rayAngle = player.angle - FOV / 2 + (column / width) * FOV;
        const rawDistance = castRay(world, player.x, player.y, rayAngle);
        const distance = rawDistance * Math.cos(rayAngle - player.angle);
        const wallHeight = Math.min(height * 1.8, height / Math.max(0.01, distance));
        const brightness = Math.max(28, 155 - distance * 15);
        context.fillStyle = `rgb(${brightness}, ${brightness * 0.72}, ${brightness * 0.58})`;
        context.fillRect(column, horizon - wallHeight / 2, 2, wallHeight);
        zBuffer[column] = distance;
        zBuffer[column + 1] = distance;
      }

      enemiesRef.current
        .map((enemy) => {
          const dx = enemy.x - player.x;
          const dy = enemy.y - player.y;
          return {
            enemy,
            distance: Math.hypot(dx, dy),
            angle: normalizeAngle(Math.atan2(dy, dx) - player.angle),
          };
        })
        .filter(({ angle }) => Math.abs(angle) < FOV * 0.72)
        .sort((left, right) => right.distance - left.distance)
        .forEach(({ enemy, distance, angle }) => {
          const screenX = width * (0.5 + angle / FOV);
          const size = Math.min(height * 1.4, (height * 0.78) / distance);
          if (distance < (zBuffer[Math.max(0, Math.min(width - 1, Math.floor(screenX)))] || 99) + 0.2) {
            if (enemy.alive) {
              drawEgg(
                context,
                eggSpriteRef.current,
                screenX,
                horizon + size * 0.08,
                size,
                time * 0.006 + enemy.phase,
                distance < 1.1,
              );
            } else {
              drawRuneStar(context, screenX, horizon + size * 0.2, size);
            }
          }
        });

      context.save();
      context.translate(width / 2, height / 2);
      context.beginPath();
      context.moveTo(-8, -12);
      context.lineTo(10, 3);
      context.lineTo(2, 5);
      context.lineTo(7, 14);
      context.lineTo(2, 17);
      context.lineTo(-3, 8);
      context.lineTo(-9, 14);
      context.closePath();
      context.fillStyle = '#f7e9c5';
      context.fill();
      context.strokeStyle = '#150d09';
      context.lineWidth = 2;
      context.stroke();
      context.restore();

    };

    renderFrameRef.current = render;
    render(window.performance.now());
    const gameLoop = window.setInterval(
      () => render(window.performance.now()),
      1000 / 30,
    );
    return () => {
      renderFrameRef.current = null;
      window.clearInterval(gameLoop);
    };
  }, []);

  return (
    <div className='egg-doom'>
      <div className='egg-doom-screen'>
        <canvas
          ref={canvasRef}
          onClick={shoot}
          aria-label='Egg Hunt 3D game viewport'
        />
        <div className='egg-doom-title'>SHELL HOUSE · {levelName}</div>
        <div className='egg-doom-hud'>
          <span>HEALTH {hud.health}</span>
          <span>EGGS {hud.score}/{levelRef.current.enemies.length}</span>
          <span>AMMO {hud.ammo}</span>
        </div>
        {jumpScare ? (
          <div className='egg-jump-scare' aria-live='assertive'>
            <img src='EggSprite.png' alt='' />
          </div>
        ) : null}
        {gameState !== 'playing' ? (
          <div className='egg-doom-result'>
            <strong>{gameState === 'won' ? 'HOUSE CLEARED' : gameOverMessage}</strong>
            <button type='button' onClick={restart}>Play again</button>
          </div>
        ) : null}
      </div>
      <div className='egg-doom-controls'>
        <div className='egg-doom-pad'>
          <button
            type='button'
            aria-label='Move forward'
            onPointerDown={() => setMovement('w', true)}
            onPointerUp={() => setMovement('w', false)}
            onPointerLeave={() => setMovement('w', false)}
          >↑</button>
          <button
            type='button'
            aria-label='Turn left'
            onPointerDown={() => setMovement('a', true)}
            onPointerUp={() => setMovement('a', false)}
            onPointerLeave={() => setMovement('a', false)}
          >←</button>
          <button
            type='button'
            aria-label='Move backward'
            onPointerDown={() => setMovement('s', true)}
            onPointerUp={() => setMovement('s', false)}
            onPointerLeave={() => setMovement('s', false)}
          >↓</button>
          <button
            type='button'
            aria-label='Turn right'
            onPointerDown={() => setMovement('d', true)}
            onPointerUp={() => setMovement('d', false)}
            onPointerLeave={() => setMovement('d', false)}
          >→</button>
        </div>
        <button type='button' className='egg-doom-fire' onClick={shoot}>FIRE</button>
        <p>WASD / arrows to move · Space or click to fire</p>
      </div>
    </div>
  );
}

EggDoom.propTypes = {
  onWin: PropTypes.func.isRequired,
};