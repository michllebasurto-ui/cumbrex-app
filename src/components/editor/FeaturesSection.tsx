import { Plus, Trash2 } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { FeaturesData, FeatureItem } from '../../types';

interface FeaturesSectionProps {
  data: FeaturesData;
  onChange: (data: FeaturesData) => void;
}

export function FeaturesSection({ data, onChange }: FeaturesSectionProps) {
  const updateTitle = (title: string) => onChange({ ...data, title });

  const updateItem = (index: number, field: keyof FeatureItem, value: string) => {
    const items = data.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    onChange({ ...data, items });
  };

  const addItem = () =>
    onChange({
      ...data,
      items: [...data.items, { icon: '⭐', title: '', description: '' }],
    });

  const removeItem = (index: number) =>
    onChange({ ...data, items: data.items.filter((_, i) => i !== index) });

  return (
    <div className="space-y-3">
      <Input
        label="Título de la sección"
        value={data.title}
        onChange={(e) => updateTitle(e.target.value)}
        placeholder="Nuestras características"
      />
      <div className="space-y-3">
        {data.items.map((item, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">Feature #{i + 1}</span>
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="text-red-400 hover:text-red-600"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <Input
                label="Icono"
                value={item.icon}
                onChange={(e) => updateItem(i, 'icon', e.target.value)}
                placeholder="⭐"
              />
              <div className="col-span-3">
                <Input
                  label="Título"
                  value={item.title}
                  onChange={(e) => updateItem(i, 'title', e.target.value)}
                  placeholder="Característica"
                />
              </div>
            </div>
            <Input
              label="Descripción"
              value={item.description}
              onChange={(e) => updateItem(i, 'description', e.target.value)}
              placeholder="Descripción breve"
            />
          </div>
        ))}
      </div>
      <Button variant="ghost" size="sm" onClick={addItem} className="w-full border border-dashed border-gray-300">
        <Plus size={14} /> Agregar feature
      </Button>
    </div>
  );
}
