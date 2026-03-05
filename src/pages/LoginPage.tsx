import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { detectTenant } from '../utils/tenant';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [detectedSubdomain, setDetectedSubdomain] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const detected = detectTenant();
    setDetectedSubdomain(detected);
    if (detected) setSubdomain(detected);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor completa todos los campos.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(email, password, subdomain || undefined);
      navigate('/app', { replace: true });
    } catch {
      setError('Credenciales inválidas. Verifica tu email y contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl">🏔️</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-3">Cumbrex</h1>
          <p className="text-gray-500 text-sm mt-1">Ingresa a tu panel de administración</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@empresa.com"
            required
            autoFocus
          />
          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          {!detectedSubdomain && (
            <Input
              label="Subdominio"
              value={subdomain}
              onChange={(e) => setSubdomain(e.target.value)}
              placeholder="mi-empresa"
            />
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <Button type="submit" variant="primary" className="w-full" loading={loading}>
            Iniciar sesión
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            ¿No tienes cuenta?{' '}
            <Link to="/app/register" className="text-blue-600 hover:underline font-medium">
              Regístrate
            </Link>
          </p>
        </div>

        {/* Demo hints */}
        <div className="mt-6 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-xs text-yellow-800 font-medium mb-1">Usuarios demo:</p>
          <p className="text-xs text-yellow-700 font-mono">acme@cumbrex.lat / Demo123!</p>
          <p className="text-xs text-yellow-700 font-mono">globex@cumbrex.lat / Demo123!</p>
        </div>
      </div>
    </div>
  );
}
