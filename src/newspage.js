import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaUserCircle } from 'react-icons/fa'
import { BsSunFill, BsMoonStarsFill } from 'react-icons/bs'
import Rain from './rain'
import DawnRain from './rainmorning'
import './index.css'





export default function NewsPage() {
  const navigate = useNavigate()
  const [articles, setArticles] = useState([])
  const [email, setEmail] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isNight, setIsNight] = useState(true)

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail')
    if (userEmail) setEmail(userEmail)
  }, []) 

  const normalizeDate = (str, now) => {
    if (!str) return { raw: new Date(0), display: 'غير محدد' }

    try {
     
      if (/\d{1,2}-\d{1,2}-14\d{2}/.test(str)) {
        return { raw: new Date(0), display: str }
      }
      if (/منذ\s+(يوم|ساعة|دقيقة)/.test(str)) {
        const pastDate = new Date(now)

        if (str.includes('دقيقة')) {
          pastDate.setMinutes(now.getMinutes() - 1)
        } else if (str.includes('ساعة')) {
          pastDate.setHours(now.getHours() - 1)
        } else if (str.includes('يوم')) {
          pastDate.setDate(now.getDate() - 1)
        }

        return { raw: pastDate, display: str }
      }

      const relativeMatch = str.match(
        /(\d+)\s*(دقيقة|دقائق|ساعة|ساعات|يوم|أيام|شهر|أشهر|سنة|سنوات)\s+مضت/
      )
      if (relativeMatch) {
        const num = parseInt(relativeMatch[1], 10)
        const unit = relativeMatch[2]
        const pastDate = new Date(now)

        if (['دقيقة', 'دقائق'].includes(unit)) {
          pastDate.setMinutes(now.getMinutes() - num)
        } else if (['ساعة', 'ساعات'].includes(unit)) {
          pastDate.setHours(now.getHours() - num)
        } else if (['يوم', 'أيام'].includes(unit)) {
          pastDate.setDate(now.getDate() - num)
        } else if (['شهر', 'أشهر'].includes(unit)) {
          pastDate.setMonth(now.getMonth() - num)
        } else if (['سنة', 'سنوات'].includes(unit)) {
          pastDate.setFullYear(now.getFullYear() - num)
        } else {
          return { raw: new Date(0), display: str }
        }

        return { raw: pastDate, display: str }
      }

      if (/منذ/.test(str)) {
        const match = str.match(
          /منذ\s+(\d+)\s*(دقيقة|دقائق|ساعة|ساعات|يوم|أيام|شهر|أشهر|سنة|سنوات)/
        )
        if (match) {
          const num = parseInt(match[1], 10)
          const unit = match[2]
          const pastDate = new Date(now)
          switch (unit) {
            case 'دقيقة':
            case 'دقائق':
              pastDate.setMinutes(now.getMinutes() - num)
              break
            case 'ساعة':
            case 'ساعات':
              pastDate.setHours(now.getHours() - num)
              break
            case 'يوم':
            case 'أيام':
              pastDate.setDate(now.getDate() - num)
              break
            case 'شهر':
            case 'أشهر':
              pastDate.setMonth(now.getMonth() - num)
              break
            case 'سنة':
            case 'سنوات':
              pastDate.setFullYear(now.getFullYear() - num)
              break
            default:
              return { raw: new Date(0), display: str }
          }
          return { raw: pastDate, display: str }
        }
      }
      if (
        str.includes('ساعة') ||
        str.includes('ساعات') ||
        str.includes('دقيقة') ||
        str.includes('دقائق')
      ) {
        
      }

      const monthsMap = {
        يناير: 'January',
        فبراير: 'February',
        مارس: 'March',
        أبريل: 'April',
        مايو: 'May',
        يونيو: 'June',
        يوليو: 'July',
        أغسطس: 'August',
        سبتمبر: 'September',
        أكتوبر: 'October',
        نوفمبر: 'November',
        ديسمبر: 'December',
      }

      let normalizedStr = str
      for (const [ar, en] of Object.entries(monthsMap)) {
        normalizedStr = normalizedStr.replace(ar, en)
      }

      normalizedStr = normalizedStr
        .replace(/الاثنين|الثلاثاء|الأربعاء|الخميس|الجمعة|السبت|الأحد/g, '')
        .replace(/الاحد|الأحد/g, '') 
        .trim()

      const englishDateRegex =
        /(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/
      normalizedStr = normalizedStr.replace(
        englishDateRegex,
        (_, d, month, y) => {
          const monthIndex = {
            January: '01',
            February: '02',
            March: '03',
            April: '04',
            May: '05',
            June: '06',
            July: '07',
            August: '08',
            September: '09',
            October: '10',
            November: '11',
            December: '12',
          }[month]
          return `${y}-${monthIndex}-${d.padStart(2, '0')}`
        }
      )

      const regexDMY = /(\d{1,2})-(\d{1,2})-(\d{4})/
      normalizedStr = normalizedStr.replace(
        regexDMY,
        (_, d, m, y) => `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
      )

      if (!/(\d{1,2}:\d{2})/.test(normalizedStr)) {
        normalizedStr += ' 12:00'
      }

      const date = new Date(normalizedStr)
      if (isNaN(date.getTime())) {
        
        return { raw: new Date(0), display: str }
      }

    
      const diffMs = now - date
      const diffMinutes = Math.floor(diffMs / (1000 * 60))
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
      const diffMonths = Math.floor(diffDays / 30)
      const diffYears = Math.floor(diffDays / 365)

      let display
      if (diffMinutes < 1) display = 'الآن'
      else if (diffMinutes < 60) display = `منذ ${diffMinutes} دقيقة`
      else if (diffHours < 24) display = `منذ ${diffHours} ساعة`
      else if (diffDays < 30) display = `منذ ${diffDays} يوم`
      else if (diffMonths < 12) display = `منذ ${diffMonths} شهر`
      else display = `منذ ${diffYears} سنة`

      return { raw: date, display }
    } catch {
      return { raw: new Date(0), display: str }
    }
  }

  useEffect(() => {
    setLoading(true)
    const now = new Date()

    fetch('https://news-production-1a16.up.railway.app/api/weather-news', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('idToken'),
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(' Network response was not ok')
        return res.json()
      })
      .then((data) => {
        const allArticles = data.flatMap((source) => source.articles)

        const normalizedArticles = allArticles.map((article) => {
          const normalized = normalizeDate(article.date, now)
          return {
            ...article,
            date: normalized.raw,
            dateFormatted: normalized.display,
            isInvalid: normalized.isInvalid,
          }
        })

        normalizedArticles.sort((a, b) => b.date.getTime() - a.date.getTime())

        setArticles(normalizedArticles)
      })
      .catch((err) => console.error('Error fetching articles:', err))
      .finally(() => setLoading(false))
  }, [])
  
  const handleLogout = () => {
    localStorage.removeItem('idToken')
    localStorage.removeItem('userEmail')
    navigate('/')
  }

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-500 ${
        isNight ? 'text-white' : 'text-gray-900'
      }`}
      dir="rtl"
    >
      {isNight ? <Rain /> : <DawnRain />}

      <div
        className={` fixed top-0 left-0 w-full z-50 flex justify-between items-center p-4  border-separate  ${
          isNight
            ? 'bg-black/30 border-white/5 text-white'
            : 'bg-rose-300/5 border-rose-300/30 text-gray-900'
        }`}
      >
        <h1 className="text-2xl font-bold tracking-wide"> 🌦️Weather News </h1>

        <div className="flex items-center gap-3 ">
          <button
            onClick={() => setIsNight(!isNight)}
            className="p-2 rounded-full hover:scale-110 transition "
          >
            {isNight ? (
              <BsMoonStarsFill className="text-blue-400 text-2xl " />
            ) : (
              <BsSunFill className="text-yellow-400 text-2xl" />
            )}
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center"
            >
              <FaUserCircle className="text-3xl" />
            </button>

            {menuOpen && (
              <div
                className={`absolute left-0 mt-3 w-56 rounded-xl shadow-lg backdrop-blur-lg p-4  ${
                  isNight
                    ? 'bg-black/60 text-white border border-white/10'
                    : 'bg-white/70 text-gray-900 border border-gray-200/30'
                }`}
              >
                <p className="text-sm mb-3 font-medium">{email || ''}</p>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-red-500 hover:bg-red-100 rounded transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

    

      <div className="flex-1 p-7 space-y-5 mt-20">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : articles.length === 0 ? (
          <p className="text-center opacity-80">No news available</p>
        ) : (
          articles.map((article, index) => (
            <div
              key={index}
              className={`rounded-2xl p-6 transition duration-300 hover:scale-[1.01] ${
                isNight
                  ? 'bg-black/5 border border-white/10 hover:bg-black/20'
                  : 'bg-rose-300/5 border border-gray-200/10 hover:bg-rose-300/10'
              }`}
            >
              <h2 className="font-bold text-xl mb-3 leading-relaxed">
                {article.title}
              </h2>
              <p className="opacity-40 text-xs mb-3">{article.dateFormatted}</p>
              <p className="leading-loose text-base opacity-70">
                {article.description}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
