import { createContext, useContext, useReducer, useCallback } from 'react';
import { orchidReducer, initialState, ACTIONS } from '../reducers/orchidReducer';
import {
  getAllOrchids,
  createOrchid,
  updateOrchid,
  deleteOrchid,
} from '../utils/orchidApi';

const OrchidContext = createContext(null);

export function OrchidProvider({ children }) {
  const [state, dispatch] = useReducer(orchidReducer, initialState);

  const fetchOrchids = useCallback(async () => {
    dispatch({ type: ACTIONS.FETCH_START });
    try {
      const res = await getAllOrchids();
      dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: res.data });
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Lỗi tải danh sách';
      dispatch({ type: ACTIONS.FETCH_ERROR, payload: errMsg });
    }
  }, []);

  const addOrchid = useCallback(async (data) => {
    const res = await createOrchid(data);
    dispatch({ type: ACTIONS.ADD, payload: res.data });
    return res.data;
  }, []);

  const editOrchid = useCallback(async (id, data) => {
    const res = await updateOrchid(id, data);
    dispatch({ type: ACTIONS.UPDATE, payload: res.data });
    return res.data;
  }, []);

  const removeOrchid = useCallback(async (id) => {
    await deleteOrchid(id);
    dispatch({ type: ACTIONS.DELETE, payload: id });
  }, []);

  return (
    <OrchidContext.Provider
      value={{
        ...state,
        fetchOrchids,
        addOrchid,
        editOrchid,
        removeOrchid,
      }}
    >
      {children}
    </OrchidContext.Provider>
  );
}

export function useOrchid() {
  const context = useContext(OrchidContext);
  if (!context) {
    throw new Error('useOrchid must be used within an OrchidProvider');
  }
  return context;
}
