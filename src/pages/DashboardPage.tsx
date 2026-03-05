import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { useTenant } from '../hooks/useTenant';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import type { Plan } from '../types';

export function DashboardPage() {
  const { user } = useAuth();
  const { tenant } = useTenant();

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Bienvenido, {user?.fullName ?? 'usuario'} 👋
        </p>
      </div>

      {/* Tenant summary */}
      {tenant && (
        <Card className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold shrink-0"
            style={{ backgroundColor: tenant.primaryColor }}
          >
            {tenant.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900">{tenant.name}</h2>
              <Badge variant={tenant.plan as Plan}>
                {tenant.plan.charAt(0).toUpperCase() + tenant.plan.slice(1)}
              </Badge>
            </div>
            <p className="text-sm text-gray-500">{tenant.subdomain}.cumbrex.lat</p>
          </div>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Páginas', value: '1 / 5', icon: '📄', color: 'bg-blue-50 text-blue-700' },
          { label: 'Módulos activos', value: '2 / 5', icon: '📦', color: 'bg-purple-50 text-purple-700' },
          { label: 'Storage usado', value: '12 MB', icon: '💾', color: 'bg-green-50 text-green-700' },
        ].map((stat) => (
          <Card key={stat.label} className={`${stat.color} border-0`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm opacity-80">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Accesos rápidos
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/app/editor"
            className="block p-5 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all group"
          >
            <span className="text-3xl">🎨</span>
            <h3 className="font-semibold text-gray-800 mt-2 group-hover:text-blue-700">
              Editar mi landing
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Personaliza tu sitio en tiempo real
            </p>
          </Link>
          <Link
            to="/app/modules"
            className="block p-5 bg-white border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all group"
          >
            <span className="text-3xl">📦</span>
            <h3 className="font-semibold text-gray-800 mt-2 group-hover:text-purple-700">
              Gestionar módulos
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Activa o desactiva funcionalidades
            </p>
          </Link>
          <Link
            to="/app/settings"
            className="block p-5 bg-white border border-gray-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all group"
          >
            <span className="text-3xl">⚙️</span>
            <h3 className="font-semibold text-gray-800 mt-2 group-hover:text-green-700">
              Configuración
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Branding, plan y configuración general
            </p>
          </Link>
          {tenant && (
            <a
              href={`https://${tenant.subdomain}.cumbrex.lat`}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-5 bg-white border border-gray-200 rounded-xl hover:border-orange-300 hover:shadow-md transition-all group"
            >
              <span className="text-3xl">🌐</span>
              <h3 className="font-semibold text-gray-800 mt-2 group-hover:text-orange-700">
                Ver mi sitio
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {tenant.subdomain}.cumbrex.lat ↗
              </p>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
