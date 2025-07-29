import SnakeGame from './components/SnakeGame'

export default function Home() {
  return (
    <main style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      flexDirection: 'column',
      color: 'white'
    }}>
      <h1>Snake Game</h1>
      <SnakeGame />
    </main>
  )
}