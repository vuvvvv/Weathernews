import { useEffect, useRef } from 'react'

export default function DawnRain() {
  const canvasRef = useRef(null)
  const rainArr = useRef([])
  const rainSpeed = 4
  const animationRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let w, h

    const updateCanvasSize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
    }

    const handleResize = () => {
      updateCanvasSize()
      initRain()
    }

    updateCanvasSize()

  
    const initRain = () => {
      rainArr.current = []
      for (let i = 0; i < 500; i++) {
        rainArr.current.push({
          x: Math.floor(Math.random() * w),
          y: Math.floor(Math.random() * (h * 0.8)), 
          z: Math.floor(Math.random() * 2) + 1,
          w: Math.floor(Math.random() * 3) + 2,
        })
      }
    }

    initRain()

   
    const drawRain = () => {
      const rainHeight = h * 1 
      const groundLevel = rainHeight 

      rainArr.current.forEach((drop) => {
        
        drop.y += drop.w * rainSpeed
        drop.x -= 5 + Math.floor(drop.y / 250) - drop.w

       
        if (drop.y >= groundLevel) {
          drop.y = -6
          drop.x = Math.floor(Math.random() * w)
        }
        if (drop.x < -10) {
          drop.x = w + 10
        }

        
        if (drop.y < rainHeight) {
          ctx.fillStyle = 'rgba(200, 200, 210, 0.3)'
          ctx.fillRect(drop.x, drop.y, drop.z, 4)
        }
      })
    }

    const loop = (currentTime) => {
      
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, w, h)

      
      drawRain()

      animationRef.current = requestAnimationFrame(loop)
    }

  
    animationRef.current = requestAnimationFrame(loop)

    
    window.addEventListener('resize', handleResize)

   
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  )
}
