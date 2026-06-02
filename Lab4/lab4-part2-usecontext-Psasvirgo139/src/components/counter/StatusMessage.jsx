import { useCounter } from '../../context/CounterContext';

export default function StatusMessage() {
  const { count } = useCounter();

  let message = 'Bằng 0';
  let badgeClass = 'bg-secondary';

  if (count > 0) {
    message = 'Dương';
    badgeClass = 'bg-success';
  } else if (count < 0) {
    message = 'Âm';
    badgeClass = 'bg-danger';
  }

  return (
    <div className="text-center my-3">
      <span className={`badge ${badgeClass} fs-5 px-3 py-2 rounded-pill shadow-sm transition`}>
        Trạng thái: {message}
      </span>
    </div>
  );
}
