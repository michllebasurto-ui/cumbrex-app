import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Paintbrush, Package, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../auth/useAuth';
import { useTenant } from '../hooks/useTenant';
import { Badge } from '../components/ui/Badge';
import type { Plan } from '../types';

const navItems = [
  { to: '/app', label: 'Dashboard', icon: <LayoutDashboard size={18} />, end: true },
  { to: '/app/editor', label: 'Editor', icon: <Paintbrush size={18} /> },
  { to: '/app/modules', label: 'Módulos', icon: <Package size={18} /> },
  { to: '/app/settings', label: 'Configuración', icon: <Settings size={18} /> },
];

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const { tenant } = useTenant();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/app/login', { replace: true });
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col bg-white border-r border-gray-200 shrink-0">
        {/* Logo + tenant */}
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏔️</span>
            <div>
              <p className="font-bold text-gray-900 text-sm">Cumbrex</p>
              {tenant && (
                <p className="text-xs text-gray-500 truncate max-w-[140px]">{tenant.name}</p>
              )}
            </div>
          </div>
          {tenant && (
            <Badge variant={tenant.plan as Plan} className="mt-2">
              {tenant.plan.charAt(0).toUpperCase() + tenant.plan.slice(1)}
            </Badge>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User info + logout */}
        <div className="px-4 py-4 border-t border-gray-100">
          {user && (
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-800 truncate">{user.fullName}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
              <Badge variant="info" className="mt-1">
                {user.role}
              </Badge>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
