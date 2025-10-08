import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DawnRain from './rainblack'

export default function AuthPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [mode, setMode] = useState('login')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const emailPattern = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/
    if (!emailPattern.test(email)) {
      setMessage('Invalid email format')
      setIsError(true)
      return
    }

    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!passwordPattern.test(password)) {
      setMessage('Weak password: use 8+ chars, upper, lower, number & symbol ')
      setIsError(true)
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const url =
        mode === 'register'
          ? `https://news-production-1a16.up.railway.app/api/auth/register`
          : `https://news-production-1a16.up.railway.app/api/auth/login`

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (res.ok) {
        if (mode === 'login') {
          localStorage.setItem('idToken', data.idToken)
          localStorage.setItem('userEmail', email)
          setIsError(false)
          navigate('/news')
        } else {
          // تسجيل مستخدم جديد → مباشرة إلى صفحة التفعيل
          localStorage.setItem('idToken', data.idToken)
          setMessage(
            'Account created successfully! Please activate your account.'
          )
          setIsError(false)
          navigate('/activate')
        }
      } else {
        setMessage(data?.error || data?.message || 'An error occurred')
        setIsError(true)
      }
    } catch (err) {
      setMessage('Connection error')
      setIsError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <DawnRain />
      <div className="w-full max-w-md rounded-2xl shadow p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          {mode === 'login' ? 'Login' : 'Register'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />
          <button
            type="submit"
            className={`w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading
              ? 'Please wait...'
              : mode === 'login'
              ? 'Login'
              : 'Register'}
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 text-center text-sm ${
              isError ? 'text-red-600' : 'text-green-600'
            }`}
          >
            {message}
          </div>
        )}

        <div className="mt-6 text-center text-white">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                className="text-blue-500 underline"
                onClick={() => {
                  setMode('register')
                  setMessage('')
                }}
              >
                Register
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                className="text-blue-500 underline"
                onClick={() => {
                  setMode('login')
                  setMessage('')
                }}
              >
                Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
