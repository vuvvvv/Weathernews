import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRive, useStateMachineInput, Layout } from '@rive-app/react-canvas'

const STATE_MACHINE = 'State Machine 1'

export default function HomePage() {
  const navigate = useNavigate()
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const touchStartTime = useRef(null)
  const lastTouchTime = useRef(0)

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  const { RiveComponent, rive } = useRive({
    src: '/sky.riv',
    stateMachines: STATE_MACHINE,
    autoplay: true,
    layout: new Layout({ fit: 'cover' }),
    onError: (error) => console.error('Error loading Rive file:', error),
  })

  const triggerClick = useStateMachineInput(rive, STATE_MACHINE, 'Trigger 1')
  const mouseListen = useStateMachineInput(rive, STATE_MACHINE, 'Boolean 1')

  const fireAnimation = () => {
    if (triggerClick) {
      triggerClick.fire()
      setTimeout(() => navigate('/login'), 1000)
    }
  }

  
  const handlePointerDown = (e) => {
    if (e.pointerType === 'touch') return
    if (mouseListen?.value === true) fireAnimation()
  }

  const handleMouseEnter = () => {
    if (mouseListen && !isTouchDevice) mouseListen.value = true
  }

  const handleMouseLeave = () => {
    if (mouseListen && !isTouchDevice) mouseListen.value = false
  }

 
  const handleTouchStart = () => {
    touchStartTime.current = Date.now()
  }

  const handleTouchEnd = (e) => {
    e.preventDefault()
    const now = Date.now()


    if (now - lastTouchTime.current < 400) {
      return
    }
    lastTouchTime.current = now

    if (!touchStartTime.current || !mouseListen) return

    const duration = now - touchStartTime.current

    if (duration > 500) {

      if (!mouseListen.value) {
        mouseListen.value = true
      } else {
      }
    } else {
      
      if (mouseListen.value) {
        fireAnimation()
      } else {
      }
    }

    touchStartTime.current = null
  }

  const styles = {
    riveContainer: { touchAction: 'none' },
  }

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden">
      <RiveComponent
        style={styles.riveContainer}
        className="w-full h-full object-cover"
        onPointerDown={handlePointerDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      />
    </div>
  )
}
