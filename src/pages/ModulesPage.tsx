import { ModuleCard } from '../components/modules/ModuleCard';
import { Spinner } from '../components/ui/Spinner';
import { useModules } from '../hooks/useModules';
import { toggleModule } from '../api/modules';

export function ModulesPage() {
  const { modules, isLoading, toggle } = useModules();

  const handleToggle = async (moduleId: string) => {
    toggle(moduleId);
    try {
      await toggleModule(moduleId);
    } catch {
      // Mock mode: local state already updated
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center flex-1 p-6">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Módulos</h1>
        <p className="text-gray-500 text-sm mt-1">
          Activa o desactiva funcionalidades de tu sitio
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            onToggle={() => handleToggle(module.id)}
          />
        ))}
      </div>
    </div>
  );
}
