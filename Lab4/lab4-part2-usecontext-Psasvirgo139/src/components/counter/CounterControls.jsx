import { useCounter } from '../../context/CounterContext';

export default function CounterControls() {
  const { increment, decrement, reset } = useCounter();

  return (
    <div className="d-flex justify-content-center gap-3 my-3">
      <button 
        onClick={decrement} 
        className="btn btn-outline-danger btn-lg px-4 py-2 rounded-pill fw-semibold shadow-sm transition"
        aria-label="−"
      >
        −
      </button>
      <button 
        onClick={reset} 
        className="btn btn-secondary btn-lg px-4 py-2 rounded-pill fw-semibold shadow-sm transition"
        aria-label="Reset"
      >
        Reset
      </button>
      <button 
        onClick={increment} 
        className="btn btn-outline-success btn-lg px-4 py-2 rounded-pill fw-semibold shadow-sm transition"
        aria-label="+"
      >
        +
      </button>
    </div>
  );
}
