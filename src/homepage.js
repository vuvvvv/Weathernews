import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRive, useStateMachineInput, Layout } from '@rive-app/react-canvas'

const STATE_MACHINE = 'State Machine 1'
const LONG_PRESS_THRESHOLD_MS = 500
const HINT_TIMEOUT_MS = 10000
const ANIMATION_DURATION_MS = 500
const MIN_TAP_INTERVAL_MS = 300

export default function HomePage() {
  const navigate = useNavigate()
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [showHint, setShowHint] = useState(true)
  const [isNavigating, setIsNavigating] = useState(false)

  const isProcessingTouch = useRef(false)
  const touchStartTime = useRef(null)
  const lastTapTime = useRef(0)
  const longPressTimer = useRef(null)

  // Initialize Rive
  const { RiveComponent, rive } = useRive({
    src: `${process.env.PUBLIC_URL}/sky.riv`,
    stateMachines: STATE_MACHINE,
    autoplay: true,
    layout: new Layout({ fit: 'cover' }),
    onError: (error) => console.error('Error loading Rive file:', error),
    onLoad: () => {
      // Log available state machines for debugging
      if (rive) {
      }
    },
  })

  // Initialize state machine inputs
  const triggerClick = useStateMachineInput(rive, STATE_MACHINE, 'Trigger 1')
  const mouseListen = useStateMachineInput(rive, STATE_MACHINE, 'Boolean 1')

  const fireAnimation = useCallback(() => {
    if (isNavigating || !triggerClick || !mouseListen) {
      return
    }

    setIsNavigating(true)
    triggerClick.fire()

    setTimeout(() => {
      navigate('/login')
    }, ANIMATION_DURATION_MS)

    setTimeout(() => {
      setIsNavigating(false)
      if (mouseListen && rive && !rive.isPaused) {
        try {
          mouseListen.value = false
        } catch (err) {}
      }
    }, ANIMATION_DURATION_MS + 500)
  }, [triggerClick, navigate, isNavigating, mouseListen, rive])

  const handlePointerDown = (e) => {
    if (showHint) setShowHint(false)
    if (e.pointerType === 'touch') return
    if (!mouseListen) {
      console.error('mouseListen is null in handlePointerDown')
      return
    }
    if (mouseListen.value === true && !isNavigating) {
      fireAnimation()
    } else {
      mouseListen.value = true
    }
  }

  const handleMouseEnter = () => {
    if (mouseListen && !isTouchDevice) {
      mouseListen.value = true
    }
  }

  const handleMouseLeave = () => {
    if (mouseListen && !isTouchDevice) {
      mouseListen.value = false
    }
  }

  const handleTouchStart = () => {
    if (showHint) setShowHint(false)
    if (isProcessingTouch.current || isNavigating || !mouseListen) {
      return
    }
    isProcessingTouch.current = true
    touchStartTime.current = Date.now()

    // Set up long press timer
    longPressTimer.current = setTimeout(() => {
      if (mouseListen && !isNavigating) {
        mouseListen.value = true // Activate first animation
      }
    }, LONG_PRESS_THRESHOLD_MS)
  }

  const handleTouchEnd = (e) => {
    e.preventDefault()
    if (!isProcessingTouch.current) return

    const now = Date.now()
    const duration = now - (touchStartTime.current || now)
    const timeSinceLastTap = now - lastTapTime.current

    clearTimeout(longPressTimer.current)

    if (!mouseListen || isNavigating) {
      isProcessingTouch.current = false

      return
    }

    if (duration >= LONG_PRESS_THRESHOLD_MS) {
    } else {
      if (timeSinceLastTap < MIN_TAP_INTERVAL_MS) {
      } else {
        if (mouseListen.value) {
          fireAnimation()
          lastTapTime.current = now
        }
      }
    }

    touchStartTime.current = null
    isProcessingTouch.current = false
  }

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
    const timer = setTimeout(() => {
      setShowHint(false)
    }, HINT_TIMEOUT_MS)
    return () => clearTimeout(timer)
  }, [])

  const styles = {
    riveContainer: { touchAction: 'none' },
  }

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-gray-900">
      <RiveComponent
        style={styles.riveContainer}
        className="w-full h-full object-cover rounded-xl shadow-2xl"
        onPointerDown={handlePointerDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      />
      {showHint && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 p-2 bg-black/50 text-white text-sm rounded-lg shadow-lg transition-opacity duration-500">
          {isTouchDevice ? (
            <span>Touch: Long press to start, tap to continue</span>
          ) : (
            <span>
              **Mouse:** Hover to start first animation, click to play second
              animation and navigate
            </span>
          )}
        </div>
      )}
    </div>
  )
}
