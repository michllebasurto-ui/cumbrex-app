import { Input } from '../ui/Input';
import type { HeroData } from '../../types';

interface HeroSectionProps {
  data: HeroData;
  onChange: (data: HeroData) => void;
}

export function HeroSection({ data, onChange }: HeroSectionProps) {
  const update = (field: keyof HeroData, value: string) =>
    onChange({ ...data, [field]: value });

  return (
    <div className="space-y-3">
      <Input
        label="Título principal"
        value={data.title}
        onChange={(e) => update('title', e.target.value)}
        placeholder="Bienvenido a nuestra empresa"
      />
      <Input
        label="Subtítulo"
        value={data.subtitle}
        onChange={(e) => update('subtitle', e.target.value)}
        placeholder="Descripción breve de tu propuesta de valor"
      />
      <Input
        label="Texto del botón CTA"
        value={data.ctaText}
        onChange={(e) => update('ctaText', e.target.value)}
        placeholder="Comenzar ahora"
      />
      <Input
        label="URL del botón CTA"
        value={data.ctaHref}
        onChange={(e) => update('ctaHref', e.target.value)}
        placeholder="#contacto"
        type="url"
      />
    </div>
  );
}
