import { useState } from 'react';
import { useTenant } from '../hooks/useTenant';
import { updateTenantConfig } from '../api/tenant';
import { useToast } from '../components/ui/Toast';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import type { Plan } from '../types';

export function SettingsPage() {
  const { tenant, refetch } = useTenant();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'general' | 'branding' | 'plan' | 'danger'>('general');
  const [name, setName] = useState(tenant?.name ?? '');
  const [customDomain, setCustomDomain] = useState(tenant?.customDomain ?? '');
  const [primaryColor, setPrimaryColor] = useState(tenant?.primaryColor ?? '#2563EB');
  const [secondaryColor, setSecondaryColor] = useState(tenant?.secondaryColor ?? '#7C3AED');
  const [logoUrl, setLogoUrl] = useState(tenant?.logoUrl ?? '');
  const [faviconUrl, setFaviconUrl] = useState(tenant?.faviconUrl ?? '');
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateTenantConfig({
        name,
        customDomain,
        primaryColor,
        secondaryColor,
        logoUrl,
        faviconUrl,
      });
      await refetch();
      toast('Configuración guardada correctamente', 'success');
    } catch {
      toast('Cambios guardados localmente (modo mock)', 'success');
    } finally {
      setSaving(false);
    }
  };

  const PLAN_FEATURES: Record<Plan, string[]> = {
    free: ['1 página', 'Subdominio .cumbrex.lat', '5 módulos básicos'],
    starter: ['3 páginas', 'Blog + Analytics', 'Dominio custom'],
    business: ['10 páginas', 'E-Commerce', 'Soporte prioritario'],
    enterprise: ['Páginas ilimitadas', 'Reservaciones', 'SLA 99.9%'],
  };

  const tabs = [
    { id: 'general', label: '⚙️ General' },
    { id: 'branding', label: '🎨 Branding' },
    { id: 'plan', label: '💳 Plan' },
    { id: 'danger', label: '🗑️ Zona de peligro' },
  ] as const;

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-500 text-sm mt-1">Administra tu tenant y sus preferencias</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* General tab */}
      {activeTab === 'general' && (
        <Card className="max-w-lg space-y-4">
          <h2 className="font-semibold text-gray-800">Información general</h2>
          <Input
            label="Nombre del tenant"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Subdominio"
            value={tenant?.subdomain ?? ''}
            disabled
            className="bg-gray-50"
          />
          <Input
            label="Dominio custom"
            value={customDomain}
            onChange={(e) => setCustomDomain(e.target.value)}
            placeholder="misitioweb.com"
            disabled={tenant?.plan === 'free' || tenant?.plan === 'starter'}
          />
          {(tenant?.plan === 'free' || tenant?.plan === 'starter') && (
            <p className="text-xs text-gray-500">🔒 Disponible desde el plan Business</p>
          )}
          <Button variant="primary" onClick={handleSave} loading={saving}>
            Guardar cambios
          </Button>
        </Card>
      )}

      {/* Branding tab */}
      {activeTab === 'branding' && (
        <Card className="max-w-lg space-y-4">
          <h2 className="font-semibold text-gray-800">Branding</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Color primario</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="h-10 w-14 rounded cursor-pointer border border-gray-300"
                />
                <span className="text-xs font-mono text-gray-500">{primaryColor}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Color secundario</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="h-10 w-14 rounded cursor-pointer border border-gray-300"
                />
                <span className="text-xs font-mono text-gray-500">{secondaryColor}</span>
              </div>
            </div>
          </div>
          <Input
            label="URL del Logo"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="https://ejemplo.com/logo.png"
            type="url"
          />
          <Input
            label="URL del Favicon"
            value={faviconUrl}
            onChange={(e) => setFaviconUrl(e.target.value)}
            placeholder="https://ejemplo.com/favicon.ico"
            type="url"
          />
          <Button variant="primary" onClick={handleSave} loading={saving}>
            Guardar cambios
          </Button>
        </Card>
      )}

      {/* Plan tab */}
      {activeTab === 'plan' && (
        <div id="plan" className="space-y-4 max-w-2xl">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-800">Plan actual</h2>
                {tenant && (
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={tenant.plan as Plan}>
                      {tenant.plan.charAt(0).toUpperCase() + tenant.plan.slice(1)}
                    </Badge>
                    <ul className="text-sm text-gray-500 flex gap-3 flex-wrap">
                      {PLAN_FEATURES[tenant.plan].map((f) => (
                        <li key={f}>✓ {f}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <Button variant="primary" size="sm">
                Cambiar plan
              </Button>
            </div>
          </Card>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {(Object.keys(PLAN_FEATURES) as Plan[]).map((p) => (
              <Card
                key={p}
                className={`text-center space-y-2 ${tenant?.plan === p ? 'border-blue-400 ring-2 ring-blue-200' : ''}`}
              >
                <Badge variant={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</Badge>
                <ul className="text-xs text-gray-500 space-y-1 text-left">
                  {PLAN_FEATURES[p].map((f) => (
                    <li key={f}>✓ {f}</li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Danger tab */}
      {activeTab === 'danger' && (
        <Card className="max-w-lg border-red-200 space-y-4">
          <h2 className="font-semibold text-red-700">⚠️ Zona de peligro</h2>
          <p className="text-sm text-gray-600">
            Esta acción eliminará permanentemente tu tenant y todos sus datos. Esta acción no se puede deshacer.
          </p>
          <Input
            label={`Escribe "${tenant?.subdomain ?? 'mi-tenant'}" para confirmar`}
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
            placeholder={tenant?.subdomain ?? 'mi-tenant'}
          />
          <Button
            variant="danger"
            disabled={deleteConfirm !== (tenant?.subdomain ?? '')}
            onClick={() => toast('Funcionalidad disponible en versión final', 'error')}
          >
            Eliminar tenant permanentemente
          </Button>
        </Card>
      )}
    </div>
  );
}
