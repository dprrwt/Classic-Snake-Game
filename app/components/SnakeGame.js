'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const GRID_SIZE = 20
const INITIAL_SNAKE = [{ x: 10, y: 10 }]
const INITIAL_FOOD = { x: 15, y: 15 }
const GAME_SPEED = 100

export default function SnakeGame() {
  // Game state using React hooks
  const [snake, setSnake] = useState(INITIAL_SNAKE)
  const [food, setFood] = useState(INITIAL_FOOD)
  const [direction, setDirection] = useState({ x: 0, y: 0 })
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [cellSize, setCellSize] = useState(20)
  const [isMobile, setIsMobile] = useState(false)
  
  // Canvas reference for drawing
  const canvasRef = useRef(null)
  const gameLoopRef = useRef(null)
  const containerRef = useRef(null)

  // Generate random food position
  const generateFood = useCallback(() => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    }
  }, [])

  // Check collision with walls or self
  const checkCollision = useCallback((head) => {
    // Wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true
    }
    
    // Self collision
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        return true
      }
    }
    
    return false
  }, [snake])

  // Move snake
  const moveSnake = useCallback(() => {
    if (!isPlaying || gameOver || (direction.x === 0 && direction.y === 0)) return

    setSnake(currentSnake => {
      const newSnake = [...currentSnake]
      const head = { ...newSnake[0] }
      
      // Move head in current direction
      head.x += direction.x
      head.y += direction.y
      
      // Check collision
      if (checkCollision(head)) {
        setGameOver(true)
        setIsPlaying(false)
        return currentSnake
      }
      
      // Add new head
      newSnake.unshift(head)
      
      // Check if food eaten
      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 10)
        setFood(generateFood())
      } else {
        // Remove tail if no food eaten
        newSnake.pop()
      }
      
      return newSnake
    })
  }, [direction, food, gameOver, isPlaying, checkCollision, generateFood])

  // Calculate responsive cell size and detect mobile
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        const maxWidth = Math.min(containerWidth - 40, 600) // Max 600px, with padding
        const newCellSize = Math.floor(maxWidth / GRID_SIZE)
        setCellSize(newCellSize)
        
        // Check if mobile based on screen width or touch capability
        const checkMobile = window.innerWidth <= 768 || 
                           ('ontouchstart' in window) || 
                           (navigator.maxTouchPoints > 0)
        setIsMobile(checkMobile)
      }
    }
    
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isPlaying) return
      
      switch(e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 })
          break
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 })
          break
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 })
          break
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 })
          break
      }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [direction, isPlaying])

  // Handle touch controls
  useEffect(() => {
    let touchStartX = 0
    let touchStartY = 0
    
    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX
      touchStartY = e.touches[0].clientY
    }
    
    const handleTouchEnd = (e) => {
      if (!isPlaying) return
      
      const touchEndX = e.changedTouches[0].clientX
      const touchEndY = e.changedTouches[0].clientY
      
      const diffX = touchEndX - touchStartX
      const diffY = touchEndY - touchStartY
      
      // Minimum swipe distance
      const minSwipeDistance = 30
      
      if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (Math.abs(diffX) > minSwipeDistance) {
          if (diffX > 0 && direction.x === 0) {
            setDirection({ x: 1, y: 0 }) // Right
          } else if (diffX < 0 && direction.x === 0) {
            setDirection({ x: -1, y: 0 }) // Left
          }
        }
      } else {
        // Vertical swipe
        if (Math.abs(diffY) > minSwipeDistance) {
          if (diffY > 0 && direction.y === 0) {
            setDirection({ x: 0, y: 1 }) // Down
          } else if (diffY < 0 && direction.y === 0) {
            setDirection({ x: 0, y: -1 }) // Up
          }
        }
      }
    }
    
    const canvas = canvasRef.current
    if (canvas) {
      canvas.addEventListener('touchstart', handleTouchStart)
      canvas.addEventListener('touchend', handleTouchEnd)
      
      return () => {
        canvas.removeEventListener('touchstart', handleTouchStart)
        canvas.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [direction, isPlaying])

  // Game loop
  useEffect(() => {
    if (isPlaying && !gameOver) {
      gameLoopRef.current = setInterval(moveSnake, GAME_SPEED)
    } else {
      clearInterval(gameLoopRef.current)
    }
    
    return () => clearInterval(gameLoopRef.current)
  }, [isPlaying, gameOver, moveSnake])

  // Draw game on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    
    // Clear canvas
    ctx.fillStyle = '#111'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Draw grid
    ctx.strokeStyle = '#333'
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath()
      ctx.moveTo(i * cellSize, 0)
      ctx.lineTo(i * cellSize, GRID_SIZE * cellSize)
      ctx.stroke()
      
      ctx.beginPath()
      ctx.moveTo(0, i * cellSize)
      ctx.lineTo(GRID_SIZE * cellSize, i * cellSize)
      ctx.stroke()
    }
    
    // Draw snake
    ctx.fillStyle = '#0f0'
    snake.forEach((segment, index) => {
      ctx.fillRect(
        segment.x * cellSize + 1,
        segment.y * cellSize + 1,
        cellSize - 2,
        cellSize - 2
      )
      
      // Make head brighter
      if (index === 0) {
        ctx.fillStyle = '#3f3'
        ctx.fillRect(
          segment.x * cellSize + 4,
          segment.y * cellSize + 4,
          cellSize - 8,
          cellSize - 8
        )
        ctx.fillStyle = '#0f0'
      }
    })
    
    // Draw food
    ctx.fillStyle = '#f00'
    ctx.fillRect(
      food.x * cellSize + 2,
      food.y * cellSize + 2,
      cellSize - 4,
      cellSize - 4
    )
  }, [snake, food, cellSize])

  // Start/Restart game
  const startGame = () => {
    setSnake(INITIAL_SNAKE)
    setFood(generateFood())
    setDirection({ x: 1, y: 0 })
    setGameOver(false)
    setScore(0)
    setIsPlaying(true)
  }

  // Handle button controls for mobile
  const handleDirectionButton = (newDirection) => {
    if (!isPlaying) return
    
    // Prevent opposite direction
    if (newDirection.x !== 0 && direction.x === 0) {
      setDirection(newDirection)
    } else if (newDirection.y !== 0 && direction.y === 0) {
      setDirection(newDirection)
    }
  }

  return (
    <div ref={containerRef} style={{ 
      textAlign: 'center', 
      width: '100%',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '0 20px'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: '10px 0' }}>Score: {score}</h2>
        {gameOver && <h3 style={{ color: 'red', margin: '10px 0' }}>Game Over!</h3>}
      </div>
      
      <canvas
        ref={canvasRef}
        width={GRID_SIZE * cellSize}
        height={GRID_SIZE * cellSize}
        style={{ 
          border: '2px solid #fff',
          backgroundColor: '#111',
          touchAction: 'none', // Prevent scrolling while swiping
          maxWidth: '100%',
          height: 'auto'
        }}
      />
      
      <div style={{ marginTop: '20px' }}>
        <button
          onClick={startGame}
          style={{
            padding: '12px 24px',
            fontSize: '18px',
            backgroundColor: '#0f0',
            color: '#000',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '5px',
            fontWeight: 'bold',
            touchAction: 'manipulation' // Better touch response
          }}
        >
          {isPlaying ? 'Restart' : 'Start Game'}
        </button>
      </div>
      
      {/* Mobile control buttons - only show on mobile */}
      {isMobile && (
        <div style={{ 
          marginTop: '30px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 80px)',
          gridTemplateRows: 'repeat(3, 80px)',
          gap: '10px',
          justifyContent: 'center',
          touchAction: 'manipulation'
        }}>
        <div />
        <button
          onClick={() => handleDirectionButton({ x: 0, y: -1 })}
          style={{
            backgroundColor: '#444',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          disabled={!isPlaying}
        >
          ↑
        </button>
        <div />
        
        <button
          onClick={() => handleDirectionButton({ x: -1, y: 0 })}
          style={{
            backgroundColor: '#444',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          disabled={!isPlaying}
        >
          ←
        </button>
        <div />
        <button
          onClick={() => handleDirectionButton({ x: 1, y: 0 })}
          style={{
            backgroundColor: '#444',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          disabled={!isPlaying}
        >
          →
        </button>
        
        <div />
        <button
          onClick={() => handleDirectionButton({ x: 0, y: 1 })}
          style={{
            backgroundColor: '#444',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          disabled={!isPlaying}
        >
          ↓
        </button>
        <div />
      </div>
      )}
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#888' }}>
        {isMobile ? (
          <p>Swipe on canvas or use buttons to control</p>
        ) : (
          <p>Use arrow keys to control the snake</p>
        )}
      </div>
    </div>
  )
}