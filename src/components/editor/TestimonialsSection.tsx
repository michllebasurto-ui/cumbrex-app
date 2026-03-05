import { Plus, Trash2 } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { TestimonialsData, TestimonialItem } from '../../types';

interface TestimonialsSectionProps {
  data: TestimonialsData;
  onChange: (data: TestimonialsData) => void;
}

export function TestimonialsSection({ data, onChange }: TestimonialsSectionProps) {
  const updateTitle = (title: string) => onChange({ ...data, title });

  const updateItem = (index: number, field: keyof TestimonialItem, value: string) => {
    const items = data.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    onChange({ ...data, items });
  };

  const addItem = () =>
    onChange({
      ...data,
      items: [...data.items, { quote: '', author: '' }],
    });

  const removeItem = (index: number) =>
    onChange({ ...data, items: data.items.filter((_, i) => i !== index) });

  return (
    <div className="space-y-3">
      <Input
        label="Título de la sección"
        value={data.title}
        onChange={(e) => updateTitle(e.target.value)}
        placeholder="Lo que dicen nuestros clientes"
      />
      <div className="space-y-3">
        {data.items.map((item, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">Testimonio #{i + 1}</span>
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="text-red-400 hover:text-red-600"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <Input
              label="Cita"
              value={item.quote}
              onChange={(e) => updateItem(i, 'quote', e.target.value)}
              placeholder="Excelente servicio..."
            />
            <Input
              label="Autor"
              value={item.author}
              onChange={(e) => updateItem(i, 'author', e.target.value)}
              placeholder="Juan Pérez, CEO de Empresa"
            />
          </div>
        ))}
      </div>
      <Button variant="ghost" size="sm" onClick={addItem} className="w-full border border-dashed border-gray-300">
        <Plus size={14} /> Agregar testimonio
      </Button>
    </div>
  );
}
