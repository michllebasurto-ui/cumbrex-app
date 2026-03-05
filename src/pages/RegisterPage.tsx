import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const TEMPLATES = [
  { id: 'default', label: 'Default', emoji: '🎨', description: 'Diseño limpio y moderno' },
  { id: 'premium', label: 'Premium', emoji: '💎', description: 'Elegante y profesional' },
  { id: 'minimal', label: 'Minimal', emoji: '⬜', description: 'Minimalista y rápido' },
  { id: 'legal', label: 'Legal', emoji: '⚖️', description: 'Para firmas y bufetes' },
];

const PLANS = [
  { id: 'free', label: 'Free', price: '$0/mes', features: ['1 página', '5 módulos básicos', 'Subdominio .cumbrex.lat'] },
  { id: 'starter', label: 'Starter', price: '$19/mes', features: ['3 páginas', 'Blog + Analytics', 'Dominio custom'] },
  { id: 'business', label: 'Business', price: '$49/mes', features: ['10 páginas', 'E-Commerce', 'Soporte prioritario'] },
  { id: 'enterprise', label: 'Enterprise', price: '$99/mes', features: ['Páginas ilimitadas', 'Reservaciones', 'SLA 99.9%'] },
];

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [template, setTemplate] = useState('default');
  const [plan, setPlan] = useState('free');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateSubdomain = (val: string) => /^[a-z0-9-]{3,30}$/.test(val);

  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (!email || !password || !fullName) return setError('Completa todos los campos.');
      if (password !== confirmPassword) return setError('Las contraseñas no coinciden.');
      if (password.length < 8) return setError('La contraseña debe tener al menos 8 caracteres.');
    }
    if (step === 2) {
      if (!companyName || !subdomain) return setError('Completa todos los campos.');
      if (!validateSubdomain(subdomain)) return setError('El subdominio debe tener entre 3 y 30 caracteres en minúsculas (a-z, 0-9, -).');
    }
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      await register({ email, password, fullName, companyName, subdomain, template, plan });
      navigate('/app/editor', { replace: true });
    } catch {
      setError('Error al crear la cuenta. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">
        <div className="text-center mb-6">
          <span className="text-4xl">🏔️</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Crear cuenta</h1>
          <div className="flex justify-center gap-2 mt-3">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-2 w-8 rounded-full transition-colors ${s <= step ? 'bg-blue-600' : 'bg-gray-200'}`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">Paso {step} de 4</p>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-700">Tu información</h2>
            <Input label="Nombre completo" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Input label="Confirmar contraseña" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-700">Tu empresa</h2>
            <Input label="Nombre de empresa" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
            <div>
              <Input
                label="Subdominio"
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value.toLowerCase())}
                placeholder="mi-empresa"
                required
              />
              {subdomain && (
                <p className={`text-xs mt-1 ${validateSubdomain(subdomain) ? 'text-green-600' : 'text-red-500'}`}>
                  {validateSubdomain(subdomain) ? '✅' : '❌'} {subdomain}.cumbrex.lat
                </p>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <h2 className="font-semibold text-gray-700">Selecciona un template</h2>
            <div className="grid grid-cols-2 gap-3">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTemplate(t.id)}
                  className={`p-4 border-2 rounded-xl text-left transition-colors ${
                    template === t.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl">{t.emoji}</span>
                  <p className="font-medium text-sm mt-1">{t.label}</p>
                  <p className="text-xs text-gray-500">{t.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-3">
            <h2 className="font-semibold text-gray-700">Selecciona tu plan</h2>
            <div className="space-y-2">
              {PLANS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlan(p.id)}
                  className={`w-full p-4 border-2 rounded-xl text-left transition-colors ${
                    plan === p.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm">{p.label}</span>
                    <span className="text-blue-600 font-bold text-sm">{p.price}</span>
                  </div>
                  <ul className="mt-1 space-y-0.5">
                    {p.features.map((f) => (
                      <li key={f} className="text-xs text-gray-500">✓ {f}</li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <p className="mt-3 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
        )}

        <div className="mt-6 flex gap-3">
          {step > 1 && (
            <Button variant="secondary" onClick={() => setStep((s) => s - 1)} className="flex-1">
              Atrás
            </Button>
          )}
          {step < 4 ? (
            <Button variant="primary" onClick={handleNext} className="flex-1">
              Siguiente
            </Button>
          ) : (
            <Button variant="primary" onClick={handleSubmit} loading={loading} className="flex-1">
              🚀 Crear mi sitio
            </Button>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          ¿Ya tienes cuenta?{' '}
          <Link to="/app/login" className="text-blue-600 hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
