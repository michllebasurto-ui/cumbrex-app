import { Plus, Trash2 } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { PricingData, PricingPlan } from '../../types';

interface PricingSectionProps {
  data: PricingData;
  onChange: (data: PricingData) => void;
}

export function PricingSection({ data, onChange }: PricingSectionProps) {
  const updateTitle = (title: string) => onChange({ ...data, title });

  const updatePlan = (index: number, field: keyof PricingPlan, value: string | string[]) => {
    const plans = data.plans.map((plan, i) =>
      i === index ? { ...plan, [field]: value } : plan,
    );
    onChange({ ...data, plans });
  };

  const addPlan = () =>
    onChange({
      ...data,
      plans: [
        ...data.plans,
        { name: 'Nuevo Plan', price: '$0/mes', features: [], ctaText: 'Comenzar' },
      ],
    });

  const removePlan = (index: number) =>
    onChange({ ...data, plans: data.plans.filter((_, i) => i !== index) });

  const updateFeatures = (planIndex: number, featuresText: string) => {
    const features = featuresText.split('\n').filter((f) => f.trim() !== '');
    updatePlan(planIndex, 'features', features);
  };

  return (
    <div className="space-y-3">
      <Input
        label="Título de la sección"
        value={data.title}
        onChange={(e) => updateTitle(e.target.value)}
        placeholder="Nuestros planes"
      />
      <div className="space-y-3">
        {data.plans.map((plan, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">Plan #{i + 1}</span>
              <button
                type="button"
                onClick={() => removePlan(i)}
                className="text-red-400 hover:text-red-600"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Nombre"
                value={plan.name}
                onChange={(e) => updatePlan(i, 'name', e.target.value)}
                placeholder="Pro"
              />
              <Input
                label="Precio"
                value={plan.price}
                onChange={(e) => updatePlan(i, 'price', e.target.value)}
                placeholder="$29/mes"
              />
            </div>
            <Input
              label="Texto del botón"
              value={plan.ctaText}
              onChange={(e) => updatePlan(i, 'ctaText', e.target.value)}
              placeholder="Comenzar"
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Features (una por línea)</label>
              <textarea
                value={plan.features.join('\n')}
                onChange={(e) => updateFeatures(i, e.target.value)}
                rows={3}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
              />
            </div>
          </div>
        ))}
      </div>
      <Button variant="ghost" size="sm" onClick={addPlan} className="w-full border border-dashed border-gray-300">
        <Plus size={14} /> Agregar plan
      </Button>
    </div>
  );
}
