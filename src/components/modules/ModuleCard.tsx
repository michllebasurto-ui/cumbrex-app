import { Toggle } from '../ui/Toggle';
import { LockedOverlay } from './LockedOverlay';
import type { ModuleWithAvailability } from '../../hooks/useModules';

interface ModuleCardProps {
  module: ModuleWithAvailability;
  onToggle: () => void;
}

export function ModuleCard({ module, onToggle }: ModuleCardProps) {
  return (
    <div className="relative bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col gap-3">
      {!module.isAvailable && (
        <LockedOverlay requiredPlan={module.requiredPlan} />
      )}
      <div className="flex items-start justify-between">
        <span className="text-3xl">{module.icon}</span>
        <Toggle
          checked={module.enabled}
          onChange={onToggle}
          disabled={!module.isAvailable}
        />
      </div>
      <div>
        <h3 className="font-semibold text-gray-800">{module.name}</h3>
        <p className="text-sm text-gray-500 mt-1">{module.description}</p>
      </div>
      <div>
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
            module.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
          }`}
        >
          {module.enabled ? 'Activo' : 'Inactivo'}
        </span>
      </div>
    </div>
  );
}
