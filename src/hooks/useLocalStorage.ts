import { useState } from 'react'

export const useLocalStorage = (keyName: string, defaultValue: unknown) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = window.localStorage.getItem(keyName)
      if (value) {
        return JSON.parse(value)
      } else {
        window.localStorage.setItem(keyName, JSON.stringify(defaultValue))
        return defaultValue
      }
    } catch {
      return defaultValue
    }
  })
  const setValue = (newValue: unknown) => {
    try {
      const value = typeof newValue === 'string' ? newValue : JSON.stringify(newValue)
      window.localStorage.setItem(keyName, value)
    } catch (err) {
      console.log(err)
    }
    setStoredValue(newValue)
  }
  return [storedValue, setValue]
}
