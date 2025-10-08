import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, CheckCircle, Loader } from 'lucide-react'

export default function ActivatePage() {
    const [message, setMessage] = useState('Activating your account...')
    const [success, setSuccess] = useState(false)
    const [unauthorized, setUnauthorized] = useState(false)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('idToken')

        if (!token) {
            setLoading(false)
            setUnauthorized(true)
            setMessage('What are you doing here? 🤨')
            return
        }

        fetch('https://news-production-1a16.up.railway.app/api/auth/activate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token,
            },
        })
            .then(async (res) => {
                const data = await res.json()
                setLoading(false)

                if (res.ok) {
                    setMessage(data.message || 'Account activated successfully!')
                    setSuccess(true)
                    setTimeout(() => navigate('/news'), 3000)
                } else {
                    setMessage(data.error || data.message || 'Activation failed')
                    if (res.status === 401 || res.status === 403) {
                        setUnauthorized(true)
                    }
                }
            })
            .catch(() => {
                setLoading(false)
                setMessage('Connection error')
            })
    }, [navigate])

    return (
        <div className={`flex items-center justify-center min-h-screen text-white overflow-hidden relative transition-all duration-1000 ${success
                ? 'bg-gradient-to-br from-gray-900 via-green-900 to-gray-900'
                : unauthorized
                    ? 'bg-gradient-to-br from-gray-900 via-red-900 to-gray-900'
                    : 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900'
            }`}>
         
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className={`absolute rounded-full opacity-10 animate-pulse ${success
                                ? 'bg-green-500'
                                : unauthorized
                                    ? 'bg-red-500'
                                    : 'bg-blue-500'
                            }`}
                        style={{
                            width: Math.random() * 300 + 50 + 'px',
                            height: Math.random() * 300 + 50 + 'px',
                            left: Math.random() * 100 + '%',
                            top: Math.random() * 100 + '%',
                            animationDelay: Math.random() * 3 + 's',
                            animationDuration: Math.random() * 5 + 3 + 's',
                        }}
                    />
                ))}
            </div>

            <div className={`relative z-10 p-8 rounded-2xl shadow-2xl max-w-md text-center backdrop-blur-sm bg-gray-800/50 transition-all duration-500 ${success
                    ? 'border border-green-500/50'
                    : unauthorized
                        ? 'border border-red-500/50'
                        : 'border border-blue-500/30'
                }`}>
             
                {unauthorized && (
                    <div className="mb-6 animate-bounce">
                        <div className="relative inline-block">
                            <AlertTriangle className="w-24 h-24 text-red-400 animate-pulse" />
                            <div className="absolute inset-0 animate-ping">
                                <AlertTriangle className="w-24 h-24 text-red-600 opacity-75" />
                            </div>
                        </div>
                    </div>
                )}

                
                {success && (
                    <div className="mb-6 animate-bounce">
                        <CheckCircle className="w-24 h-24 text-green-400 mx-auto animate-pulse" />
                    </div>
                )}

        
                {loading && (
                    <div className="mb-6">
                        <Loader className="w-24 h-24 text-blue-400 mx-auto animate-spin" />
                    </div>
                )}

                <h2 className={`text-3xl font-bold mb-4 bg-gradient-to-r bg-clip-text text-transparent ${success
                        ? 'from-green-400 to-emerald-600'
                        : unauthorized
                            ? 'from-red-400 to-rose-600'
                            : 'from-blue-400 to-cyan-600'
                    }`}>
                    {unauthorized ? 'Access Denied!' : 'Account Activation'}
                </h2>
      
                <div className={`text-lg font-semibold transition-all duration-500 ${unauthorized
                        ? 'text-red-300 animate-pulse scale-110'
                        : success
                            ? 'text-green-400'
                            : 'text-gray-300'
                    }`}>
                    {message}
                </div>

                {unauthorized && (
                    <div className="mt-6 space-y-3 animate-fade-in">
                        <p className="text-red-400 text-sm">
                            🚫 You shouldn't be here!
                        </p>
                        <p className="text-gray-400 text-xs">
                            Please login first to access this page
                        </p>
                        <button
                            onClick={() => navigate('/login')}
                            className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-all transform hover:scale-105 active:scale-95"
                        >
                            Go to Login
                        </button>
                    </div>
                )}

                {success && (
                    <p className="text-sm text-gray-400 mt-4 animate-pulse">
                        Redirecting to news page...
                    </p>
                )}
            </div>
        </div>
    )
}