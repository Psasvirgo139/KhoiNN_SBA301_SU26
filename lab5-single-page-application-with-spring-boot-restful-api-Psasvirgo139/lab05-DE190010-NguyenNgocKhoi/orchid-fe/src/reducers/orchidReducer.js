export const ACTIONS = {
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  ADD: 'ADD',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
};

export const initialState = {
  orchids: [],
  loading: false,
  error: '',
};

export function orchidReducer(state, action) {
  switch (action.type) {
    case ACTIONS.FETCH_START:
      return {
        ...state,
        loading: true,
        error: '',
      };
    case ACTIONS.FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        orchids: action.payload,
      };
    case ACTIONS.FETCH_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case ACTIONS.ADD:
      return {
        ...state,
        orchids: [...state.orchids, action.payload],
      };
    case ACTIONS.UPDATE:
      return {
        ...state,
        orchids: state.orchids.map((item) =>
          item.orchidId === action.payload.orchidId ? action.payload : item
        ),
      };
    case ACTIONS.DELETE:
      return {
        ...state,
        orchids: state.orchids.filter((item) => item.orchidId !== action.payload),
      };
    default:
      return state;
  }
}
