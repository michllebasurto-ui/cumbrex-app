import { Plus, Trash2 } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { FooterData, FooterLink } from '../../types';

interface FooterSectionProps {
  data: FooterData;
  onChange: (data: FooterData) => void;
}

export function FooterSection({ data, onChange }: FooterSectionProps) {
  const updateText = (text: string) => onChange({ ...data, text });

  const updateLink = (index: number, field: keyof FooterLink, value: string) => {
    const links = data.links.map((link, i) =>
      i === index ? { ...link, [field]: value } : link,
    );
    onChange({ ...data, links });
  };

  const addLink = () =>
    onChange({ ...data, links: [...data.links, { label: '', href: '#' }] });

  const removeLink = (index: number) =>
    onChange({ ...data, links: data.links.filter((_, i) => i !== index) });

  return (
    <div className="space-y-3">
      <Input
        label="Texto del footer"
        value={data.text}
        onChange={(e) => updateText(e.target.value)}
        placeholder="© 2025 Mi Empresa. Todos los derechos reservados."
      />
      <div className="space-y-2">
        <span className="text-sm font-medium text-gray-700">Links</span>
        {data.links.map((link, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              value={link.label}
              onChange={(e) => updateLink(i, 'label', e.target.value)}
              placeholder="Texto del link"
              className="flex-1"
            />
            <Input
              value={link.href}
              onChange={(e) => updateLink(i, 'href', e.target.value)}
              placeholder="URL"
              type="url"
              className="flex-1"
            />
            <button
              type="button"
              onClick={() => removeLink(i)}
              className="text-red-400 hover:text-red-600 mt-1"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      <Button variant="ghost" size="sm" onClick={addLink} className="w-full border border-dashed border-gray-300">
        <Plus size={14} /> Agregar link
      </Button>
    </div>
  );
}
