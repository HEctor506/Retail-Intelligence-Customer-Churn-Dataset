import { ref, onValue, off } from 'firebase/database'
import { db } from './config'

// Path real en Firebase: "Customer Churn dataset/Data/0/json/customers"
const CUSTOMERS_PATH = 'Customer Churn dataset/Data/0/json/customers'

/**
 * Suscribe a los clientes en Realtime Database.
 * Llama a onData(array) cuando llegan datos, onError(err) si falla.
 * Devuelve una función para cancelar la suscripción.
 */
export function subscribeToCustomers(onData, onError) {
  const customersRef = ref(db, CUSTOMERS_PATH)

  onValue(
    customersRef,
    (snapshot) => {
      const raw = snapshot.val()
      if (!raw) {
        onData([])
        return
      }
      // Firebase devuelve un objeto { C000001: {...}, C000002: {...} }
      // Lo convertimos a array incluyendo el customer_id como campo
      const customers = Object.entries(raw).map(([id, fields]) => ({
        customer_id: id,
        ...fields,
      }))
      onData(customers)
    },
    (error) => {
      console.error('Firebase error:', error)
      onError(error)
    }
  )

  // Retorna función para desuscribir
  return () => off(customersRef)
}
