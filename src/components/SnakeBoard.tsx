'use client';

import { motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { GamepadIcon } from '@/components/icons';
import { Button, Card, CardContent } from '@/components/ui';

const GRID_SIZE = 18;
const INITIAL_SNAKE = [
  { x: 8, y: 9 },
  { x: 7, y: 9 },
  { x: 6, y: 9 },
];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const INITIAL_TICK_MS = 150;
const MIN_TICK_MS = 65;
const LEVEL_UP_EVERY = 5;
const SPEED_STEP_MS = 10;
const STORAGE_KEY = 'cpr-snake-best-score';
const LEVEL_UP_FLASH_MS = 1400;

type Point = { x: number; y: number };

type GameStatus = 'idle' | 'running' | 'paused' | 'gameover';

function randomFood(snake: Point[]) {
  while (true) {
    const food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    if (!snake.some((part) => part.x === food.x && part.y === food.y))
      return food;
  }
}

function getLevel(score: number) {
  return Math.floor(score / LEVEL_UP_EVERY) + 1;
}

function getTickMs(level: number) {
  return Math.max(MIN_TICK_MS, INITIAL_TICK_MS - (level - 1) * SPEED_STEP_MS);
}

function runSnakeGameTests() {
  const occupied = new Set(INITIAL_SNAKE.map((part) => `${part.x}-${part.y}`));

  for (let i = 0; i < 25; i += 1) {
    const food = randomFood(INITIAL_SNAKE);
    if (
      food.x < 0 ||
      food.x >= GRID_SIZE ||
      food.y < 0 ||
      food.y >= GRID_SIZE
    ) {
      throw new Error('randomFood returned coordinates outside the grid');
    }
    if (occupied.has(`${food.x}-${food.y}`)) {
      throw new Error('randomFood returned a position on the snake');
    }
  }

  if (getLevel(0) !== 1) throw new Error('Level should start at 1 for score 0');
  if (getLevel(4) !== 1)
    throw new Error('Level should remain 1 before threshold');
  if (getLevel(5) !== 2) throw new Error('Level should increase at threshold');
  if (getTickMs(1) !== INITIAL_TICK_MS)
    throw new Error('Tick should start at initial speed');
  if (getTickMs(2) >= getTickMs(1))
    throw new Error('Tick should decrease when level increases');
  if (getTickMs(999) !== MIN_TICK_MS)
    throw new Error('Tick should respect minimum speed');
}

function useSnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>(() => randomFood(INITIAL_SNAKE));
  const [status, setStatus] = useState<GameStatus>('idle');
  const [{ score, bestScore }, dispatchScore] = useReducer(
    (
      state: { score: number; bestScore: number },
      action: 'increment' | 'reset',
    ) => {
      if (action === 'increment') {
        const next = state.score + 1;
        const newBest = Math.max(state.bestScore, next);
        if (newBest > state.bestScore) {
          try {
            window.localStorage.setItem(STORAGE_KEY, String(newBest));
          } catch {}
        }
        return { score: next, bestScore: newBest };
      }
      return { score: 0, bestScore: state.bestScore };
    },
    undefined,
    (): { score: number; bestScore: number } => {
      let best = 0;
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = Number(stored);
          if (!Number.isNaN(parsed)) best = parsed;
        }
      } catch {}
      return { score: 0, bestScore: best };
    },
  );
  const directionRef = useRef<Point>(INITIAL_DIRECTION);
  const queuedDirectionRef = useRef<Point | null>(null);

  const isRunning = status === 'running';
  const isGameOver = status === 'gameover';
  const level = getLevel(score);
  const tickMs = getTickMs(level);

  const resetBoard = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setFood(randomFood(INITIAL_SNAKE));
    directionRef.current = INITIAL_DIRECTION;
    queuedDirectionRef.current = null;
    dispatchScore('reset');
  }, []);

  const startGame = useCallback(() => {
    resetBoard();
    setStatus('running');
  }, [resetBoard]);

  const togglePause = useCallback(() => {
    setStatus((prev) => {
      if (prev === 'running') return 'paused';
      if (prev === 'paused') return 'running';
      return prev;
    });
  }, []);

  const goHome = useCallback(() => {
    resetBoard();
    setStatus('idle');
  }, [resetBoard]);

  const changeDirection = useCallback(
    (next: Point) => {
      if (status !== 'running') return;
      const current = queuedDirectionRef.current || directionRef.current;
      const isOpposite = current.x + next.x === 0 && current.y + next.y === 0;
      const isSame = current.x === next.x && current.y === next.y;
      if (isOpposite || isSame) return;
      queuedDirectionRef.current = next;
    },
    [status],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        [
          'ArrowUp',
          'ArrowDown',
          'ArrowLeft',
          'ArrowRight',
          ' ',
          'Enter',
        ].includes(e.key)
      ) {
        e.preventDefault();
      }

      if (
        (status === 'idle' || status === 'gameover') &&
        (e.key === 'Enter' || e.key === ' ')
      ) {
        startGame();
        return;
      }

      if ((status === 'running' || status === 'paused') && e.key === ' ') {
        togglePause();
        return;
      }

      if (e.key === 'ArrowUp') changeDirection({ x: 0, y: -1 });
      if (e.key === 'ArrowDown') changeDirection({ x: 0, y: 1 });
      if (e.key === 'ArrowLeft') changeDirection({ x: -1, y: 0 });
      if (e.key === 'ArrowRight') changeDirection({ x: 1, y: 0 });
    };

    window.addEventListener('keydown', onKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [changeDirection, startGame, status, togglePause]);

  useEffect(() => {
    if (!isRunning) return undefined;

    const id = window.setInterval(() => {
      setSnake((currentSnake) => {
        const nextDirection =
          queuedDirectionRef.current || directionRef.current;
        directionRef.current = nextDirection;
        queuedDirectionRef.current = null;

        const head = currentSnake[0];
        const nextHead = {
          x: head.x + nextDirection.x,
          y: head.y + nextDirection.y,
        };

        const hitWall =
          nextHead.x < 0 ||
          nextHead.y < 0 ||
          nextHead.x >= GRID_SIZE ||
          nextHead.y >= GRID_SIZE;
        const hitSelf = currentSnake.some(
          (part, index) =>
            index !== 0 && part.x === nextHead.x && part.y === nextHead.y,
        );

        if (hitWall || hitSelf) {
          setStatus('gameover');
          return currentSnake;
        }

        const ateFood = nextHead.x === food.x && nextHead.y === food.y;
        const nextSnake = [nextHead, ...currentSnake];

        if (ateFood) {
          dispatchScore('increment');
          setFood(randomFood(nextSnake));
          return nextSnake;
        }

        nextSnake.pop();
        return nextSnake;
      });
    }, tickMs);

    return () => window.clearInterval(id);
  }, [food, isRunning, tickMs]);

  return {
    snake,
    food,
    status,
    isRunning,
    isGameOver,
    score,
    bestScore,
    level,
    tickMs,
    startGame,
    togglePause,
    goHome,
    changeDirection,
  };
}

export function SnakeBoard() {
  useEffect(() => {
    runSnakeGameTests();
  }, []);

  const {
    snake,
    food,
    status,
    isRunning,
    isGameOver,
    score,
    bestScore,
    level,
    tickMs,
    startGame,
    togglePause,
    goHome,
    changeDirection,
  } = useSnakeGame();

  const snakeSet = useMemo(
    () => new Set(snake.map((part) => `${part.x}-${part.y}`)),
    [snake],
  );

  return (
    <Card className="bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden">
      <CardContent className="p-5 md:p-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-white/50">
              Mini game
            </div>
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <GamepadIcon className="w-5 h-5" />
              Snake.exe
            </h3>
          </div>
          <div className="flex items-center gap-6 text-right">
            <div>
              <div className="text-xs text-white/50">Level</div>
              <div className="text-2xl font-bold text-white">{level}</div>
            </div>
            <div>
              <div className="text-xs text-white/50">Score</div>
              <div className="text-2xl font-bold text-white">{score}</div>
            </div>
            <div>
              <div className="text-xs text-white/50">Best</div>
              <div className="text-2xl font-bold text-white/85">
                {bestScore}
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div
            className="grid gap-[3px] rounded-2xl bg-white/5 p-3 border border-white/10"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
              const x = i % GRID_SIZE;
              const y = Math.floor(i / GRID_SIZE);
              const isSnake = snakeSet.has(`${x}-${y}`);
              const isHead = snake[0]?.x === x && snake[0]?.y === y;
              const isFood = food.x === x && food.y === y;

              return (
                <div
                  key={`${x}-${y}`}
                  className={[
                    'aspect-square rounded-[6px]',
                    isHead
                      ? 'bg-white shadow-[0_0_18px_rgba(255,255,255,0.45)]'
                      : isSnake
                        ? 'bg-white/70'
                        : isFood
                          ? 'bg-fuchsia-400 shadow-[0_0_18px_rgba(232,121,249,0.55)]'
                          : 'bg-white/[0.04]',
                  ].join(' ')}
                />
              );
            })}
          </div>

          {status === 'running' && level > 1 && (
            <motion.div
              key={level}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.92, 1, 1, 1.06] }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
            >
              <div className="rounded-2xl border border-fuchsia-400/30 bg-black/60 px-6 py-3 text-center shadow-2xl backdrop-blur-md">
                <div className="text-xs uppercase tracking-[0.3em] text-fuchsia-300/70">
                  Level up
                </div>
                <div className="text-3xl font-semibold text-white">
                  Nivel {level}
                </div>
              </div>
            </motion.div>
          )}

          {status !== 'running' && (
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-[#07070a]/72 backdrop-blur-[2px]">
              <div className="max-w-xs text-center px-6">
                {status === 'idle' && (
                  <>
                    <div className="text-xs uppercase tracking-[0.3em] text-fuchsia-300/70 mb-2">
                      Press start
                    </div>
                    <h4 className="text-3xl font-semibold text-white mb-3">
                      Ready to play?
                    </h4>
                    <p className="text-sm text-white/65 mb-5">
                      Empieza despacio, sube niveles y rompe tu récord local.
                    </p>
                    <Button onClick={startGame} className="px-5 py-3">
                      Start game
                    </Button>
                  </>
                )}

                {status === 'paused' && (
                  <>
                    <div className="text-xs uppercase tracking-[0.3em] text-white/50 mb-2">
                      Paused
                    </div>
                    <h4 className="text-3xl font-semibold text-white mb-3">
                      Partida en pausa
                    </h4>
                    <p className="text-sm text-white/65 mb-5">
                      Pulsa espacio o continúa cuando quieras.
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <Button onClick={togglePause} className="px-5 py-3">
                        Resume
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={goHome}
                        className="px-5 py-3"
                      >
                        Home
                      </Button>
                    </div>
                  </>
                )}

                {isGameOver && (
                  <>
                    <div className="text-xs uppercase tracking-[0.3em] text-fuchsia-300/70 mb-2">
                      Game over
                    </div>
                    <h4 className="text-3xl font-semibold text-white mb-3">
                      Buen intento
                    </h4>
                    <p className="text-sm text-white/65 mb-5">
                      Has llegado al nivel {level} con {score} puntos.
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <Button onClick={startGame} className="px-5 py-3">
                        Play again
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={goHome}
                        className="px-5 py-3"
                      >
                        Home
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button
            onClick={() => (isRunning ? togglePause() : startGame())}
            className="px-4 py-2"
          >
            {isRunning ? 'Pause' : status === 'paused' ? 'Resume' : 'Start'}
          </Button>
          <Button variant="secondary" onClick={goHome} className="px-4 py-2">
            Home
          </Button>
          <div className="text-sm text-white/60">
            Flechas para jugar. Espacio para pausar. Velocidad actual: {tickMs}{' '}
            ms.
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-5 max-w-[180px] mx-auto">
          <div />
          <Button
            variant="outline"
            className="rounded-xl px-0 py-2"
            onClick={() => changeDirection({ x: 0, y: -1 })}
          >
            ↑
          </Button>
          <div />
          <Button
            variant="outline"
            className="rounded-xl px-0 py-2"
            onClick={() => changeDirection({ x: -1, y: 0 })}
          >
            ←
          </Button>
          <Button
            variant="outline"
            className="rounded-xl px-0 py-2"
            onClick={() => changeDirection({ x: 0, y: 1 })}
          >
            ↓
          </Button>
          <Button
            variant="outline"
            className="rounded-xl px-0 py-2"
            onClick={() => changeDirection({ x: 1, y: 0 })}
          >
            →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
