import { CounterProvider } from '../context/CounterContext';
import CounterDisplay from '../components/counter/CounterDisplay';
import CounterControls from '../components/counter/CounterControls';
import StatusMessage from '../components/counter/StatusMessage';

export default function Ex01CounterPage() {
  return (
    <CounterProvider>
      <div className="container max-w-md mx-auto my-5 p-4 bg-white rounded shadow-sm border border-light">
        <h1 className="text-center mb-4 fs-3 fw-bold text-dark">Bài 1 – Counter (useContext)</h1>
        <div className="p-3">
          <CounterDisplay />
          <CounterControls />
          <StatusMessage />
        </div>
      </div>
    </CounterProvider>
  );
}
