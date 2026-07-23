import { createContext, useContext, useReducer, useCallback } from 'react'
import { orchidReducer, initialState, ACTIONS } from '../reducers/orchidReducer'
import { getAllOrchids, createOrchid, updateOrchid, deleteOrchid } from '../utils/orchidApi'

const OrchidContext = createContext(null)

export function OrchidProvider({ children }) {
  const [state, dispatch] = useReducer(orchidReducer, initialState)

  const fetchOrchids = useCallback(async () => {
    dispatch({ type: ACTIONS.FETCH_START })
    try {
      const res = await getAllOrchids()
      dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: res.data })
    } catch (err) {
      dispatch({ type: ACTIONS.FETCH_ERROR, payload: err.message })
    }
  }, [])

  const addOrchid = useCallback(async (data) => {
    const res = await createOrchid(data)
    dispatch({ type: ACTIONS.ADD, payload: res.data })
  }, [])

  const editOrchid = useCallback(async (id, data) => {
    const res = await updateOrchid(id, data)
    dispatch({ type: ACTIONS.UPDATE, payload: res.data })
  }, [])

  const removeOrchid = useCallback(async (id) => {
    await deleteOrchid(id)
    dispatch({ type: ACTIONS.DELETE, payload: id })
  }, [])

  return (
    <OrchidContext.Provider value={{ ...state, fetchOrchids, addOrchid, editOrchid, removeOrchid }}>
      {children}
    </OrchidContext.Provider>
  )
}

export function useOrchid() {
  const ctx = useContext(OrchidContext)
  if (!ctx) {
    throw new Error('useOrchid phải dùng trong OrchidProvider')
  }
  return ctx
}
