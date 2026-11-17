import React, { useState, useCallback, useRef, useEffect } from 'react'

// --- Game Constants ---
const WIDTH = 375
const HEIGHT = 667
const GROUND_Y = 520
const GRAVITY = 0.6
const JUMP_FORCE = -11
const INITIAL_SPEED = 6
const MAX_SPEED = 14
const SPEED_INCREMENT = 0.002
const WALNUT_SPAWN_CHANCE = 0.015
const OBSTACLE_SPAWN_CHANCE = 0.012
const OBSTACLE_TYPES = ['log', 'rock', 'creature']

// --- Types ---
type GameState = 'menu' | 'playing' | 'gameOver'

// --- Colors (Arslanbob palette) ---
const COLORS = {
  sky: '#1a1a2e',
  ground: '#2d4a3e',
  groundDark: '#1e3a2e',
  walnut: '#8b4513',
  walnutShine: '#d2691e',
  player: '#4f46e5',
  playerOutline: '#312e81',
  kalpak: '#ffffff',
  outfit: '#dc2626',
  log: '#5d4037',
  rock: '#78716c',
  creature: '#7c3aed',
  text: '#ffffff',
  accent: '#fbbf24'
}

// --- Utility ---
const rand = (min: number, max: number) => Math.random() * (max - min) + min

export default function ArslanbobRunner() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameState, setGameState] = useState<GameState>('menu')
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [walnuts, setWalnuts] = useState(0)

  // Game refs
  const rafRef = useRef<number>(0)
  const speedRef = useRef(INITIAL_SPEED)
  const frameRef = useRef(0)
  const walnutImages: HTMLImageElement[] = []
  const obstacleImages: HTMLImageElement[] = []

  // --- Game Objects ---
  const [player, setPlayer] = useState({
    x: 80,
    y: GROUND_Y - 60,
    width: 44,
    height: 60,
    vy: 0,
    grounded: false,
    jumpCount: 0
  })

  const [walnutList, setWalnutList] = useState<Array<{x:number,y:number,w:number,h:number,collected:boolean}>>([])
  const [obstacleList, setObstacleList] = useState<Array<{x:number,y:number,w:number,h:number,type:string,passed:boolean}>>([])

  // --- Input ---
  const handleJump = useCallback(() => {
    if (gameState !== 'playing') return
    if (player.grounded || player.jumpCount < 2) {
      setPlayer(prev => ({
        ...prev,
        vy: JUMP_FORCE,
        grounded: false,
        jumpCount: prev.grounded ? 1 : prev.jumpCount + 1
      }))
    }
  }, [gameState, player.grounded, player.jumpCount])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') handleJump()
      if (e.code === 'KeyR' && gameState === 'gameOver') restart()
    }
    const onTouch = () => { if (gameState === 'playing') handleJump(); else if (gameState === 'menu') startGame(); else if (gameState === 'gameOver') restart() }
    window.addEventListener('keydown', onKey)
    window.addEventListener('touchstart', onTouch, { passive: true })
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('touchstart', onTouch)
    }
  }, [gameState, player.grounded, player.jumpCount, handleJump])

  const startGame = useCallback(() => {
    setGameState('playing')
    setScore(0)
    setWalnuts(0)
    setWalnutList([])
    setObstacleList([])
    speedRef.current = INITIAL_SPEED
    frameRef.current = 0
    setPlayer({
      x: 80, y: GROUND_Y - 60, width: 44, height: 60, vy: 0, grounded: true, jumpCount: 0
    })
  }, [])

  const restart = useCallback(() => {
    setGameState('playing')
    setScore(0)
    setWalnuts(0)
    setWalnutList([])
    setObstacleList([])
    speedRef.current = INITIAL_SPEED
    frameRef.current = 0
    setPlayer({
      x: 80, y: GROUND_Y - 60, width: 44, height: 60, vy: 0, grounded: true, jumpCount: 0
    })
  }, [])

  // --- Physics ---
  const updatePlayer = useCallback(() => {
    setPlayer(prev => {
      let { y, vy, grounded } = prev
      vy += GRAVITY
      y += vy

      if (y > GROUND_Y - prev.height) {
        y = GROUND_Y - prev.height
        vy = 0
        grounded = true
        prev.jumpCount = 0
      }

      return { ...prev, y, vy, grounded }
    })
  }, [])

  const spawnEntities = useCallback(() => {
    frameRef.current++

    // Increase speed
    speedRef.current = Math.min(MAX_SPEED, speedRef.current + SPEED_INCREMENT)

    // Spawn walnuts
    if (Math.random() < WALNUT_SPAWN_CHANCE) {
      setWalnutList(prev => [
        ...prev,
        { x: WIDTH + 40, y: rand(GROUND_Y - 180, GROUND_Y - 100), w: 24, h: 24, collected: false }
      ])
    }

    // Spawn obstacles
    if (frameRef.current % 60 === 0 && Math.random() < OBSTACLE_SPAWN_CHANCE) {
      const type = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)]
      const sizes: Record<string, {w:number,h:number,y:number}> = {
        log: { w: 50, h: 30, y: GROUND_Y - 40 },
        rock: { w: 34, h: 34, y: GROUND_Y - 44 },
        creature: { w: 46, h: 52, y: GROUND_Y - 62 }
      }
      const s = sizes[type]
      setObstacleList(prev => [
        ...prev,
        { x: WIDTH + 40, y: s.y, w: s.w, h: s.h, type, passed: false }
      ])
    }

    // Move walnuts
    setWalnutList(prev => prev.map(w => ({ ...w, x: w.x - speedRef.current })).filter(w => w.x + w.w > -20))

    // Move obstacles
    setObstacleList(prev => prev.map(o => ({ ...o, x: o.x - speedRef.current })).filter(o => o.x + o.w > -20))

    // Score
    setScore(prev => prev + 1)
  }, [])

  // --- Collision ---
  const rectIntersect = (r1: {x:number,y:number,w:number,h:number}, r2: {x:number,y:number,w:number,h:number}) =>
    r1.x < r2.x + r2.w && r1.x + r1.w > r2.x && r1.y < r2.y + r2.h && r1.y + r1.h > r2.y

  const checkCollisions = useCallback(() => {
    const pRect = { x: player.x + 8, y: player.y + 10, w: player.width - 16, h: player.height - 20 }

    // Walnut collection
    setWalnutList(prev => {
      let newWalnutCount = 0
      const next = prev.map(w => {
        if (!w.collected && rectIntersect(pRect, w)) {
          newWalnutCount++
          return { ...w, collected: true }
        }
        return w
      })
      if (newWalnutCount > 0) setWalnuts(prev => prev + newWalnutCount)
      return next.filter(w => !w.collected || w.x > -100)
    })

    // Obstacle collision
    const hit = obstacleList.some(o => rectIntersect(pRect, o))
    if (hit) {
      setGameState('gameOver')
      if (score > highScore) setHighScore(score)
    }
  }, [player, obstacleList, score, highScore])

  // --- Render ---
  const drawPlayer = (ctx: CanvasRenderingContext2D, p: typeof player) => {
    const { x, y, width, height } = p
    const cx = x + width / 2
    const cy = y + height / 2

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)'
    ctx.beginPath()
    ctx.ellipse(cx, GROUND_Y - 8, width * 0.6, 8, 0, 0, Math.PI * 2)
    ctx.fill()

    // Body
    ctx.fillStyle = COLORS.player
    ctx.beginPath()
    ctx.ellipse(cx, cy - 10, width * 0.45, height * 0.5, 0, 0, Math.PI * 2)
    ctx.fill()

    // Head
    ctx.fillStyle = COLORS.player
    ctx.beginPath()
    ctx.arc(cx, cy - 30, width * 0.42, 0, Math.PI * 2)
    ctx.fill()

    // Kalpak (hat)
    ctx.fillStyle = COLORS.kalpak
    ctx.beginPath()
    ctx.arc(cx, cy - 42, width * 0.42, 0, Math.PI)
    ctx.fill()
    ctx.fillStyle = COLORS.playerOutline
    ctx.beginPath()
    ctx.arc(cx, cy - 42, width * 0.42, 0, Math.PI)
    ctx.stroke()

    // Outfit
    ctx.fillStyle = COLORS.outfit
    ctx.fillRect(x + 6, y + 10, width - 12, height - 20)
    ctx.fillStyle = COLORS.accent
    ctx.fillRect(x + 12, y + 20, width - 24, 6)

    // Legs (running animation)
    const legOffset = Math.sin(frameRef.current * 0.3) * 4
    ctx.fillStyle = COLORS.playerOutline
    ctx.fillRect(x + 8, y + height - 14 + legOffset, 10, 14)
    ctx.fillRect(x + width - 18, y + height - 14 - legOffset, 10, 14)

    // Arms
    ctx.fillStyle = COLORS.player
    ctx.fillRect(x + 4, y + 8, 8, 16)
    ctx.fillRect(x + width - 12, y + 8, 8, 16)

    // Eyes
    ctx.fillStyle = '#000'
    ctx.beginPath()
    ctx.arc(cx - 8, cy - 34, 3, 0, Math.PI * 2)
    ctx.arc(cx + 8, cy - 34, 3, 0, Math.PI * 2)
    ctx.fill()
  }

  const drawWalnut = (ctx: CanvasRenderingContext2D, w: {x:number,y:number,w:number,h:number}) => {
    ctx.fillStyle = COLORS.walnut
    ctx.beginPath()
    ctx.arc(w.x + w.w/2, w.y + w.h/2, w.w/2, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = COLORS.walnutShine
    ctx.beginPath()
    ctx.arc(w.x + w.w/2 - 4, w.y + w.h/2 - 4, 4, 0, Math.PI * 2)
    ctx.fill()
  }

  const drawObstacle = (ctx: CanvasRenderingContext2D, o: {x:number,y:number,w:number,h:number,type:string}) => {
    switch (o.type) {
      case 'log':
        ctx.fillStyle = COLORS.log
        ctx.fillRect(o.x, o.y, o.w, o.h)
        ctx.strokeStyle = '#3e2723'
        ctx.lineWidth = 2
        ctx.strokeRect(o.x, o.y, o.w, o.h)
        // Rings
        ctx.strokeStyle = '#3e2723'
        ctx.beginPath()
        ctx.arc(o.x + o.w/2, o.y + o.h/2, o.w/3, 0, Math.PI * 2)
        ctx.stroke()
        break
      case 'rock':
        ctx.fillStyle = COLORS.rock
        ctx.beginPath()
        ctx.moveTo(o.x, o.y + o.h)
        ctx.lineTo(o.x + o.w/2, o.y)
        ctx.lineTo(o.x + o.w, o.y + o.h)
        ctx.closePath()
        ctx.fill()
        break
      case 'creature':
        ctx.fillStyle = COLORS.creature
        ctx.beginPath()
        ctx.ellipse(o.x + o.w/2, o.y + o.h/2, o.w/2, o.h/2, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#fff'
        ctx.beginPath()
        ctx.arc(o.x + o.w/2 - 6, o.y + o.h/2 - 4, 4, 0, Math.PI * 2)
        ctx.arc(o.x + o.w/2 + 6, o.y + o.h/2 - 4, 4, 0, Math.PI * 2)
        ctx.fill()
        break
    }
  }

  const drawBackground = (ctx: CanvasRenderingContext2D) => {
    // Sky gradient
    const grad = ctx.createLinearGradient(0, 0, 0, HEIGHT)
    grad.addColorStop(0, '#1a1a2e')
    grad.addColorStop(1, '#2d4a3e')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, WIDTH, HEIGHT)

    // Distant mountains
    ctx.fillStyle = '#16213e'
    ctx.beginPath()
    ctx.moveTo(0, GROUND_Y)
    ctx.lineTo(60, GROUND_Y - 90)
    ctx.lineTo(160, GROUND_Y - 30)
    ctx.lineTo(260, GROUND_Y - 100)
    ctx.lineTo(360, GROUND_Y - 40)
    ctx.lineTo(WIDTH, GROUND_Y)
    ctx.fill()

    // Foreground ground
    ctx.fillStyle = COLORS.ground
    ctx.fillRect(0, GROUND_Y, WIDTH, HEIGHT - GROUND_Y)
    ctx.fillStyle = COLORS.groundDark
    ctx.fillRect(0, GROUND_Y, WIDTH, 6)
  }

  const drawUI = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = 'rgba(0,0,0,0.4)'
    ctx.fillRect(0, 0, WIDTH, 60)

    ctx.fillStyle = COLORS.text
    ctx.font = 'bold 20px system-ui, sans-serif'
    ctx.fillText(`🌰 ${walnuts}`, 20, 38)

    ctx.font = '16px system-ui, sans-serif'
    ctx.fillText(`Distance: ${Math.floor(score / 10)}m`, WIDTH - 160, 38)
    ctx.fillText(`Best: ${Math.floor(highScore / 10)}m`, WIDTH - 160, 56)
  }

  const drawGameOver = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = 'rgba(0,0,0,0.55)'
    ctx.fillRect(0, 0, WIDTH, HEIGHT)

    ctx.fillStyle = COLORS.text
    ctx.font = 'bold 32px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('GAME OVER', WIDTH / 2, HEIGHT / 2 - 40)

    ctx.font = '18px system-ui, sans-serif'
    ctx.fillStyle = COLORS.accent
    ctx.fillText(`Distance: ${Math.floor(score / 10)}m`, WIDTH / 2, HEIGHT / 2)
    ctx.fillText(`Walnuts: ${walnuts}`, WIDTH / 2, HEIGHT / 2 + 30)

    ctx.fillStyle = COLORS.text
    ctx.font = '16px system-ui, sans-serif'
    ctx.fillText('Tap or Space to restart', WIDTH / 2, HEIGHT / 2 + 80)
    ctx.textAlign = 'left'
  }

  const drawMenu = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = 'rgba(0,0,0,0.45)'
    ctx.fillRect(0, 0, WIDTH, HEIGHT)

    ctx.fillStyle = COLORS.text
    ctx.font = 'bold 34px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('🌰 Arslanbob Runner', WIDTH / 2, HEIGHT / 2 - 60)

    ctx.font = '18px system-ui, sans-serif'
    ctx.fillStyle = COLORS.accent
    ctx.fillText('Endless Runner • Kyrgyzstan', WIDTH / 2, HEIGHT / 2 - 20)

    ctx.fillStyle = COLORS.text
    ctx.font = '16px system-ui, sans-serif'
    ctx.fillText('Tap or Space to jump', WIDTH / 2, HEIGHT / 2 + 30)
    ctx.fillText('Avoid logs, rocks & creatures', WIDTH / 2, HEIGHT / 2 + 55)

    if (highScore > 0) {
      ctx.fillStyle = COLORS.accent
      ctx.fillText(`Best: ${Math.floor(highScore / 10)}m`, WIDTH / 2, HEIGHT / 2 + 90)
    }

    ctx.textAlign = 'left'
  }

  // --- Main Loop ---
  const tick = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Resize canvas to CSS size
    canvas.width = WIDTH
    canvas.height = HEIGHT

    drawBackground(ctx)

    if (gameState === 'playing') {
      updatePlayer()
      spawnEntities()
      checkCollisions()
    }

    // Draw entities
    walnutList.forEach(w => drawWalnut(ctx, w))
    obstacleList.forEach(o => drawObstacle(ctx, o))
    drawPlayer(ctx, player)
    drawUI(ctx)

    if (gameState === 'gameOver') {
      drawGameOver(ctx)
    } else if (gameState === 'menu') {
      drawMenu(ctx)
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [gameState, player, walnutList, obstacleList, score, highScore, walnuts, updatePlayer, spawnEntities, checkCollisions])

  useEffect(() => {
    if (gameState === 'playing' || gameState === 'menu') {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(tick)
    }
    return () => cancelAnimationFrame(rafRef.current)
  }, [gameState, tick])

  return (
    <div className="relative w-full h-screen bg-[#0f172a] flex items-center justify-center overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 pointer-events-none" />

      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        className="rounded-2xl shadow-2xl shadow-black/60 border border-white/10 bg-[#1e293b]"
      />

      {/* Overlay controls hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium tracking-widest animate-pulse">
        SPACE / TAP TO JUMP
      </div>

      {/* Mobile-friendly cover layer for touch */}
      <div className="absolute inset-0 w-full h-full z-10" onTouchStart={() => { if (gameState === 'menu') startGame(); else if (gameState === 'gameOver') restart(); else handleJump() }} />
    </div>
  )
}
