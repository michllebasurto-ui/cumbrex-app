import { useState, useEffect } from 'react';
import type { Module, Plan } from '../types';
import { getModules } from '../api/modules';
import { isModuleAvailable } from '../utils/featureFlags';
import { useTenant } from './useTenant';

const MOCK_MODULES: Module[] = [
  {
    id: 'blog',
    name: 'Blog',
    description: 'Publica artículos y noticias en tu sitio web.',
    icon: '📝',
    enabled: false,
    requiredPlan: 'starter',
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce',
    description: 'Vende productos y servicios directamente desde tu landing.',
    icon: '🛒',
    enabled: false,
    requiredPlan: 'business',
  },
  {
    id: 'booking',
    name: 'Reservaciones',
    description: 'Permite a tus clientes reservar citas o servicios.',
    icon: '📅',
    enabled: false,
    requiredPlan: 'enterprise',
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'Visualiza estadísticas de visitas y conversiones.',
    icon: '📊',
    enabled: true,
    requiredPlan: 'starter',
  },
  {
    id: 'contact-form',
    name: 'Formulario de Contacto',
    description: 'Recibe mensajes de tus visitantes directamente en tu bandeja.',
    icon: '✉️',
    enabled: true,
    requiredPlan: 'free',
  },
];

export interface ModuleWithAvailability extends Module {
  isAvailable: boolean;
}

export function useModules() {
  const { tenant } = useTenant();
  const [modules, setModules] = useState<ModuleWithAvailability[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getModules()
      .then((data) => {
        if (!cancelled) {
          const plan = tenant?.plan ?? 'free';
          setIsLoading(false);
          setModules(
            data.map((m) => ({
              ...m,
              isAvailable: isModuleAvailable(m.id, plan as Plan),
            })),
          );
        }
      })
      .catch(() => {
        if (!cancelled) {
          const plan = tenant?.plan ?? 'free';
          setModules(
            MOCK_MODULES.map((m) => ({
              ...m,
              isAvailable: isModuleAvailable(m.id, plan as Plan),
            })),
          );
          setError(null);
          setIsLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [tenant?.plan]);

  const toggle = (moduleId: string) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId ? { ...m, enabled: !m.enabled } : m,
      ),
    );
  };

  return { modules, isLoading, error, toggle };
}
