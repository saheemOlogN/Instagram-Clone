import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

const ThemeToggle = () => {
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark')
        localStorage.setItem('theme', theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme(currentTheme => currentTheme === 'dark' ? 'light' : 'dark')
    }

    return (
        <button
            type='button'
            onClick={toggleTheme}
            className='flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white/50 text-foreground shadow-sm backdrop-blur-md transition hover:bg-white/70 dark:bg-white/10 dark:hover:bg-white/15'
            aria-label='Toggle theme'
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
    )
}

export default ThemeToggle
