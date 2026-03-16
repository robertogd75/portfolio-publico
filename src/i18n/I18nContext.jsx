import { createContext, useContext, useState, useEffect } from 'react'
import { translations } from './translations'

const I18nContext = createContext()

export function I18nProvider({ children }) {
  const [lang, setLang] = useState('es') // Default to es

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('portfolio_lang')
    if (saved && ['es', 'en', 'de'].includes(saved)) {
      setLang(saved)
    }
  }, [])

  // Change language and persist
  const changeLanguage = (newLang) => {
    setLang(newLang)
    localStorage.setItem('portfolio_lang', newLang)
    document.documentElement.lang = newLang
  }

  // Translation hook function
  const t = (section, key) => {
    if (!translations[lang] || !translations[lang][section] || !translations[lang][section][key]) {
      console.warn(`Translation missing for: ${lang}.${section}.${key}`)
      return key
    }
    return translations[lang][section][key]
  }

  return (
    <I18nContext.Provider value={{ lang, changeLanguage, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export const useTranslation = () => useContext(I18nContext)
