import { AuthProvider, useAuth } from '../context/AuthContext';
import AuthNavbar from '../components/auth/AuthNavbar';
import LoginForm from '../components/auth/LoginForm';
import Dashboard from '../components/auth/Dashboard';

function PageContent() {
  const { user } = useAuth();

  return (
    <div className="container max-w-lg mx-auto my-5 p-4 bg-light rounded shadow-sm border border-light">
      <AuthNavbar />
      <div className="py-3">
        {user ? <Dashboard /> : <LoginForm />}
      </div>
    </div>
  );
}

export default function Ex02LoginPage() {
  return (
    <AuthProvider>
      <PageContent />
    </AuthProvider>
  );
}
