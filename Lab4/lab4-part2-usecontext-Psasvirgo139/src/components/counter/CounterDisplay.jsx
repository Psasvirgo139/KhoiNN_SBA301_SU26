import { useCounter } from '../../context/CounterContext';

export default function CounterDisplay() {
  const { count } = useCounter();

  return (
    <div className="card text-center my-4 p-4 shadow-sm border-0 bg-light rounded-3">
      <h2 className="text-secondary mb-2 uppercase tracking-wide fs-6 text-uppercase">Current Count</h2>
      <div className="display-1 fw-bold text-primary transition-all duration-300 transform scale-100 hover:scale-105" data-testid="count-value">
        {count}
      </div>
    </div>
  );
}
