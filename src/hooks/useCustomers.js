import { useState, useEffect } from 'react'
import { subscribeToCustomers } from '../firebase/db'
import { customers as mockCustomers } from '../data/mockData'

/**
 * Hook que carga clientes desde Firebase Realtime Database.
 * Si Firebase falla, cae al mock data como fallback.
 */
export function useCustomers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [source, setSource] = useState(null) // 'firebase' | 'mock'

  useEffect(() => {
    const unsubscribe = subscribeToCustomers(
      (data) => {
        if (data.length > 0) {
          setCustomers(data)
          setSource('firebase')
        } else {
          setCustomers(mockCustomers)
          setSource('mock')
        }
        setLoading(false)
        setError(null)
      },
      (err) => {
        console.warn('Firebase no disponible, usando mock data:', err.message)
        setCustomers(mockCustomers)
        setSource('mock')
        setError(err.message)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  return { customers, loading, error, source }
}
