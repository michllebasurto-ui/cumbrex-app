import { Input } from '../ui/Input';
import type { GeneralData } from '../../types';

interface GeneralSectionProps {
  data: GeneralData;
  onChange: (data: GeneralData) => void;
}

export function GeneralSection({ data, onChange }: GeneralSectionProps) {
  const update = (field: keyof GeneralData, value: string) =>
    onChange({ ...data, [field]: value });

  return (
    <div className="space-y-3">
      <Input
        label="Nombre del sitio"
        value={data.name}
        onChange={(e) => update('name', e.target.value)}
        placeholder="Mi Empresa"
      />
      <Input
        label="URL del Logo"
        value={data.logoUrl}
        onChange={(e) => update('logoUrl', e.target.value)}
        placeholder="https://ejemplo.com/logo.png"
        type="url"
      />
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Color primario</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={data.primaryColor}
              onChange={(e) => update('primaryColor', e.target.value)}
              className="h-9 w-12 rounded cursor-pointer border border-gray-300"
            />
            <span className="text-xs text-gray-500 font-mono">{data.primaryColor}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Color secundario</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={data.secondaryColor}
              onChange={(e) => update('secondaryColor', e.target.value)}
              className="h-9 w-12 rounded cursor-pointer border border-gray-300"
            />
            <span className="text-xs text-gray-500 font-mono">{data.secondaryColor}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
