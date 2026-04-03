'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';

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

function randomFood(snake) {
  while (true) {
    const food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    if (!snake.some((part) => part.x === food.x && part.y === food.y)) return food;
  }
}

function getLevel(score) {
  return Math.floor(score / LEVEL_UP_EVERY) + 1;
}

function getTickMs(level) {
  return Math.max(MIN_TICK_MS, INITIAL_TICK_MS - (level - 1) * SPEED_STEP_MS);
}

function Card({ className = '', children }) {
  return <div className={`rounded-3xl border border-white/10 ${className}`}>{children}</div>;
}

function CardContent({ className = '', children }) {
  return <div className={className}>{children}</div>;
}

function Button({ className = '', variant = 'default', children, type = 'button', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-2xl transition-all duration-200 font-medium';
  const styles = {
    default: 'bg-white text-black hover:bg-white/90',
    outline: 'border border-white/15 bg-white/5 text-white hover:bg-white/10',
    secondary: 'bg-white/10 text-white hover:bg-white/15 border border-white/10',
  };

  return (
    <button type={type} className={`${base} ${styles[variant] || styles.default} ${className}`} {...props}>
      {children}
    </button>
  );
}

function IconBase({ className = '', children, viewBox = '0 0 24 24' }) {
  return (
    <svg
      aria-hidden="true"
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  );
}

function SparklesIcon({ className = 'w-5 h-5' }) {
  return (
    <IconBase className={className}>
      <path d="M12 3l1.3 3.7L17 8l-3.7 1.3L12 13l-1.3-3.7L7 8l3.7-1.3L12 3z" />
      <path d="M19 14l.7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7L19 14z" />
      <path d="M5 14l.9 2.1L8 17l-2.1.9L5 20l-.9-2.1L2 17l2.1-.9L5 14z" />
    </IconBase>
  );
}

function CodeIcon({ className = 'w-4 h-4' }) {
  return (
    <IconBase className={className}>
      <path d="M8 16l-4-4 4-4" />
      <path d="M16 8l4 4-4 4" />
      <path d="M14 4l-4 16" />
    </IconBase>
  );
}

function ArrowRightIcon({ className = 'w-4 h-4' }) {
  return (
    <IconBase className={className}>
      <path d="M5 12h14" />
      <path d="M13 5l7 7-7 7" />
    </IconBase>
  );
}

function MailIcon({ className = 'w-4 h-4' }) {
  return (
    <IconBase className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </IconBase>
  );
}

function GamepadIcon({ className = 'w-5 h-5' }) {
  return (
    <IconBase className={className}>
      <path d="M6 12h12" />
      <path d="M8 10v4" />
      <path d="M16 11h.01" />
      <path d="M18 13h.01" />
      <path d="M7.5 8h9a4.5 4.5 0 014.4 5.5l-.6 2.5a2.5 2.5 0 01-4 1.4L14.5 16h-5l-1.8 1.4a2.5 2.5 0 01-4-1.4l-.6-2.5A4.5 4.5 0 017.5 8z" />
    </IconBase>
  );
}

function GithubIcon({ className = 'w-4 h-4' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.36 6.84 9.71.5.1.68-.22.68-.49 0-.24-.01-1.05-.01-1.9-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .08 1.53 1.06 1.53 1.06.9 1.57 2.35 1.12 2.92.86.09-.67.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.05 0-1.12.39-2.03 1.03-2.74-.11-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0112 6.84c.85 0 1.7.12 2.5.36 1.9-1.33 2.74-1.05 2.74-1.05.56 1.41.21 2.45.1 2.71.64.71 1.03 1.62 1.03 2.74 0 3.92-2.33 4.78-4.56 5.04.36.32.68.95.68 1.92 0 1.38-.01 2.49-.01 2.83 0 .27.18.59.69.49A10.27 10.27 0 0022 12.23C22 6.58 17.52 2 12 2z" />
    </svg>
  );
}

function LinkedinIcon({ className = 'w-4 h-4' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M6.94 8.5A1.56 1.56 0 106.93 5.4 1.56 1.56 0 006.94 8.5zM5.6 9.7h2.67V18H5.6V9.7zm4.35 0h2.56v1.13h.04c.36-.68 1.23-1.4 2.53-1.4 2.7 0 3.2 1.82 3.2 4.19V18H15.6v-3.9c0-.93-.02-2.12-1.26-2.12-1.27 0-1.47 1.02-1.47 2.06V18H9.95V9.7z" />
    </svg>
  );
}

function runSnakeGameTests() {
  const occupied = new Set(INITIAL_SNAKE.map((part) => `${part.x}-${part.y}`));

  for (let i = 0; i < 25; i += 1) {
    const food = randomFood(INITIAL_SNAKE);
    if (food.x < 0 || food.x >= GRID_SIZE || food.y < 0 || food.y >= GRID_SIZE) {
      throw new Error('randomFood returned coordinates outside the grid');
    }
    if (occupied.has(`${food.x}-${food.y}`)) {
      throw new Error('randomFood returned a position on the snake');
    }
  }

  if (getLevel(0) !== 1) throw new Error('Level should start at 1 for score 0');
  if (getLevel(4) !== 1) throw new Error('Level should remain 1 before threshold');
  if (getLevel(5) !== 2) throw new Error('Level should increase at threshold');
  if (getTickMs(1) !== INITIAL_TICK_MS) throw new Error('Tick should start at initial speed');
  if (getTickMs(2) >= getTickMs(1)) throw new Error('Tick should decrease when level increases');
  if (getTickMs(999) !== MIN_TICK_MS) throw new Error('Tick should respect minimum speed');
}

function useSnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  // Use an off-grid sentinel so server and client agree on initial render.
  // The real random position is set in the first effect after hydration.
  const [food, setFood] = useState({ x: -1, y: -1 });
  const [status, setStatus] = useState('idle');
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [levelFlash, setLevelFlash] = useState(false);
  const directionRef = useRef(INITIAL_DIRECTION);
  const queuedDirectionRef = useRef(null);
  const lastLevelRef = useRef(1);

  const isRunning = status === 'running';
  const isGameOver = status === 'gameover';
  const level = getLevel(score);
  const tickMs = getTickMs(level);

  useEffect(() => {
    setFood(randomFood(INITIAL_SNAKE));
  }, []);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = Number(stored);
        if (!Number.isNaN(parsed)) setBestScore(parsed);
      }
    } catch {
      // ignore preview/localStorage issues
    }
  }, []);

  useEffect(() => {
    if (score <= bestScore) return;
    setBestScore(score);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(score));
    } catch {
      // ignore preview/localStorage issues
    }
  }, [score, bestScore]);

  useEffect(() => {
    if (level <= lastLevelRef.current) return undefined;
    lastLevelRef.current = level;
    setLevelFlash(true);
    const timeoutId = window.setTimeout(() => setLevelFlash(false), LEVEL_UP_FLASH_MS);
    return () => window.clearTimeout(timeoutId);
  }, [level]);

  const resetBoard = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setFood(randomFood(INITIAL_SNAKE));
    directionRef.current = INITIAL_DIRECTION;
    queuedDirectionRef.current = null;
    setScore(0);
    setLevelFlash(false);
    lastLevelRef.current = 1;
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

  const changeDirection = useCallback((next) => {
    if (status !== 'running') return;
    const current = queuedDirectionRef.current || directionRef.current;
    const isOpposite = current.x + next.x === 0 && current.y + next.y === 0;
    const isSame = current.x === next.x && current.y === next.y;
    if (isOpposite || isSame) return;
    queuedDirectionRef.current = next;
  }, [status]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Enter'].includes(e.key)) {
        e.preventDefault();
      }

      if ((status === 'idle' || status === 'gameover') && (e.key === 'Enter' || e.key === ' ')) {
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
        const nextDirection = queuedDirectionRef.current || directionRef.current;
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
          (part, index) => index !== 0 && part.x === nextHead.x && part.y === nextHead.y
        );

        if (hitWall || hitSelf) {
          setStatus('gameover');
          return currentSnake;
        }

        const ateFood = nextHead.x === food.x && nextHead.y === food.y;
        const nextSnake = [nextHead, ...currentSnake];

        if (ateFood) {
          setScore((prev) => prev + 1);
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
    levelFlash,
    tickMs,
    startGame,
    togglePause,
    goHome,
    changeDirection,
  };
}

function SnakeBoard() {
  const {
    snake,
    food,
    status,
    isRunning,
    isGameOver,
    score,
    bestScore,
    level,
    levelFlash,
    tickMs,
    startGame,
    togglePause,
    goHome,
    changeDirection,
  } = useSnakeGame();

  const snakeSet = useMemo(() => new Set(snake.map((part) => `${part.x}-${part.y}`)), [snake]);

  return (
    <Card className="bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden">
      <CardContent className="p-5 md:p-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-white/50">Mini game</div>
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
              <div className="text-2xl font-bold text-white/85">{bestScore}</div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div
            className="grid gap-[3px] rounded-2xl bg-white/5 p-3 border border-white/10"
            style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
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

          {levelFlash && status === 'running' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.92, 1, 1, 1.06] }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
            >
              <div className="rounded-2xl border border-fuchsia-400/30 bg-black/60 px-6 py-3 text-center shadow-2xl backdrop-blur-md">
                <div className="text-xs uppercase tracking-[0.3em] text-fuchsia-300/70">Level up</div>
                <div className="text-3xl font-semibold text-white">Nivel {level}</div>
              </div>
            </motion.div>
          )}

          {status !== 'running' && (
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-[#07070a]/72 backdrop-blur-[2px]">
              <div className="max-w-xs text-center px-6">
                {status === 'idle' && (
                  <>
                    <div className="text-xs uppercase tracking-[0.3em] text-fuchsia-300/70 mb-2">Press start</div>
                    <h4 className="text-3xl font-semibold text-white mb-3">Ready to play?</h4>
                    <p className="text-sm text-white/65 mb-5">Empieza despacio, sube niveles y rompe tu récord local.</p>
                    <Button onClick={startGame} className="px-5 py-3">Start game</Button>
                  </>
                )}

                {status === 'paused' && (
                  <>
                    <div className="text-xs uppercase tracking-[0.3em] text-white/50 mb-2">Paused</div>
                    <h4 className="text-3xl font-semibold text-white mb-3">Partida en pausa</h4>
                    <p className="text-sm text-white/65 mb-5">Pulsa espacio o continúa cuando quieras.</p>
                    <div className="flex items-center justify-center gap-3">
                      <Button onClick={togglePause} className="px-5 py-3">Resume</Button>
                      <Button variant="secondary" onClick={goHome} className="px-5 py-3">Home</Button>
                    </div>
                  </>
                )}

                {isGameOver && (
                  <>
                    <div className="text-xs uppercase tracking-[0.3em] text-fuchsia-300/70 mb-2">Game over</div>
                    <h4 className="text-3xl font-semibold text-white mb-3">Buen intento</h4>
                    <p className="text-sm text-white/65 mb-5">Has llegado al nivel {level} con {score} puntos.</p>
                    <div className="flex items-center justify-center gap-3">
                      <Button onClick={startGame} className="px-5 py-3">Play again</Button>
                      <Button variant="secondary" onClick={goHome} className="px-5 py-3">Home</Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button onClick={() => (isRunning ? togglePause() : startGame())} className="px-4 py-2">
            {isRunning ? 'Pause' : status === 'paused' ? 'Resume' : 'Start'}
          </Button>
          <Button variant="secondary" onClick={goHome} className="px-4 py-2">
            Home
          </Button>
          <div className="text-sm text-white/60">
            Flechas para jugar. Espacio para pausar. Velocidad actual: {tickMs} ms.
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-5 max-w-[180px] mx-auto">
          <div />
          <Button variant="outline" className="rounded-xl px-0 py-2" onClick={() => changeDirection({ x: 0, y: -1 })}>↑</Button>
          <div />
          <Button variant="outline" className="rounded-xl px-0 py-2" onClick={() => changeDirection({ x: -1, y: 0 })}>←</Button>
          <Button variant="outline" className="rounded-xl px-0 py-2" onClick={() => changeDirection({ x: 0, y: 1 })}>↓</Button>
          <Button variant="outline" className="rounded-xl px-0 py-2" onClick={() => changeDirection({ x: 1, y: 0 })}>→</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function FloatingOrb({ className }) {
  return (
    <motion.div
      animate={{ y: [0, -12, 0], opacity: [0.35, 0.55, 0.35] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      className={`absolute rounded-full blur-3xl ${className}`}
    />
  );
}

export function LandingClient() {
  useEffect(() => {
    runSnakeGameTests();
  }, []);

  const featureCards = [
    {
      title: 'Ingeniería con criterio',
      text: 'Me gusta construir productos digitales sólidos, rápidos y bien pensados, cuidando tanto la arquitectura como la experiencia final.',
    },
    {
      title: 'Personalidad sin artificios',
      text: 'No busco una web fría ni estándar: prefiero una experiencia elegante, clara y con identidad propia, sin artificios innecesarios.',
    },
    {
      title: 'Mentalidad de producto',
      text: 'No me centro solo en escribir código. También valoro rendimiento, claridad, mantenibilidad y el impacto real de lo que se lanza.',
    },
  ];

  const featuredProjects = [
    {
      title: 'Frontend Engineering',
      description: 'Desarrollo de interfaces cuidadas, mantenibles y rápidas, con foco en experiencia de usuario, rendimiento y calidad de código.',
      tags: ['Next.js', 'React', 'TypeScript'],
    },
    {
      title: 'Arquitectura y rendimiento',
      description: 'Interés especial por la escalabilidad del frontend, la organización del código, el caching y la optimización real en producción.',
      tags: ['Performance', 'Caching', 'DX'],
    },
    {
      title: 'Producto digital',
      description: 'Me gusta trabajar pensando no solo en implementar, sino en construir soluciones útiles, claras y sostenibles en el tiempo.',
      tags: ['Product', 'UX', 'Impact'],
    },
    {
      title: 'Side projects',
      description: 'Exploro ideas propias, experimentos visuales y pequeños productos con potencial de crecer más allá de una simple demo.',
      tags: ['Indie hacking', 'Games', 'Experiments'],
    },
  ];

  const socialLinks = [
    { label: 'Email', href: 'mailto:hola@carlosperezroca.com', icon: MailIcon },
    { label: 'GitHub', href: '#', icon: GithubIcon },
    { label: 'LinkedIn', href: '#', icon: LinkedinIcon },
  ];

  return (
    <div className="min-h-screen bg-[#07070a] text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.18),_transparent_30%),radial-gradient(circle_at_80%_20%,_rgba(255,255,255,0.08),_transparent_20%),linear-gradient(to_bottom,_rgba(255,255,255,0.02),_transparent)]" />
      <FloatingOrb className="w-72 h-72 bg-fuchsia-500/20 top-8 -left-12" />
      <FloatingOrb className="w-96 h-96 bg-cyan-500/10 bottom-12 right-0" />

      <div className="relative max-w-7xl mx-auto px-6 py-8 md:px-10 md:py-10">
        <header className="flex items-center justify-between gap-4 mb-14">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center shadow-lg">
              <SparklesIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm text-white/60">carlosperezroca.com</div>
              <div className="font-semibold tracking-wide">Carlos Pérez Roca · Software Engineer</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-3 text-sm text-white/70">
            <a href="#about" className="hover:text-white transition-colors">Sobre mí</a>
            <a href="#projects" className="hover:text-white transition-colors">Proyectos</a>
            <a href="#contact" className="hover:text-white transition-colors">Contacto</a>
          </nav>
        </header>

        <section className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center min-h-[70vh]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 mb-6">
                <CodeIcon className="w-4 h-4" />
                Software, producto y experiencias digitales bien pensadas.
              </div>

              <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[0.95] max-w-3xl">
                Frontend, producto y experiencias web
                <span className="text-white/55"> con criterio, claridad </span>
                y atención al detalle.
              </h1>

              <p className="mt-6 max-w-2xl text-lg md:text-xl text-white/65 leading-relaxed">
                Soy Carlos Pérez Roca, ingeniero de software centrado en frontend y producto digital. Disfruto construyendo experiencias bien pensadas, rápidas y mantenibles, sin renunciar a una capa visual con personalidad. Esta web mezcla presentación personal, enfoque profesional y una forma de construir con detalle, claridad y personalidad.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a href="#projects">
                  <Button className="px-6 py-4 text-base">
                    Ver enfoque
                    <ArrowRightIcon className="w-4 h-4" />
                  </Button>
                </a>
                <a href="#contact">
                  <Button variant="outline" className="px-6 py-4 text-base">
                    Contactar
                  </Button>
                </a>
              </div>

              <div className="mt-10 flex flex-wrap gap-3 text-sm text-white/60">
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Next.js</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">React</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">TypeScript</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Performance</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Product mindset</span>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <SnakeBoard />
          </motion.div>
        </section>

        <section id="about" className="grid md:grid-cols-3 gap-5 mt-16">
          {featureCards.map((item) => (
            <Card key={item.title} className="bg-white/5 backdrop-blur-xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-white/65 leading-relaxed">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section id="projects" className="mt-20">
          <div className="flex items-end justify-between gap-6 mb-6">
            <div>
              <div className="text-sm uppercase tracking-[0.25em] text-white/45 mb-2">Showcase</div>
              <h2 className="text-3xl md:text-4xl font-semibold">Qué puedo aportar</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
            {featuredProjects.map((item) => (
              <Card key={item.title} className="bg-white/[0.04] hover:bg-white/[0.06] transition-colors">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3 text-white">{item.title}</h3>
                  <p className="text-white/70 leading-relaxed mb-4">{item.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/65">
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="contact" className="mt-20 mb-8">
          <Card className="rounded-[2rem] bg-gradient-to-br from-white/10 to-white/[0.03] backdrop-blur-xl overflow-hidden">
            <CardContent className="p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="text-sm uppercase tracking-[0.25em] text-white/45 mb-2">Contacto</div>
                <h2 className="text-3xl font-semibold mb-3">Hablemos</h2>
                <p className="text-white/65 max-w-2xl">
                  Si te interesa mi perfil, quieres hablar de frontend, arquitectura, producto o simplemente te ha gustado la idea de esta web, aquí tienes una forma directa de contactar conmigo. El siguiente paso ideal es sustituir estos enlaces por mis perfiles reales y convertir esta landing en mi carta de presentación definitiva.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {socialLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a key={item.label} href={item.href} target={item.href === '#' ? undefined : '_blank'} rel={item.href === '#' ? undefined : 'noreferrer'}>
                      <Button variant="outline" className="px-4 py-3">
                        <Icon className="w-4 h-4" />
                        {item.label}
                      {item.href === '#' && <span className="text-white/40">· pronto</span>}
                      </Button>
                    </a>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

