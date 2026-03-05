import { Accordion } from '../ui/Accordion';
import { Toggle } from '../ui/Toggle';
import { Button } from '../ui/Button';
import { GeneralSection } from './GeneralSection';
import { HeroSection } from './HeroSection';
import { FeaturesSection } from './FeaturesSection';
import { TestimonialsSection } from './TestimonialsSection';
import { PricingSection } from './PricingSection';
import { FooterSection } from './FooterSection';
import type {
  Section,
  GeneralData,
  HeroData,
  FeaturesData,
  TestimonialsData,
  PricingData,
  FooterData,
} from '../../types';

interface EditorPanelProps {
  sections: Section[];
  onSectionChange: (sectionId: string, data: Section['data']) => void;
  onToggleSection: (sectionId: string, enabled: boolean) => void;
  onSave: () => void;
  onPublish: () => void;
  isSaving: boolean;
  isPublishing: boolean;
}

export function EditorPanel({
  sections,
  onSectionChange,
  onToggleSection,
  onSave,
  onPublish,
  isSaving,
  isPublishing,
}: EditorPanelProps) {
  const general = sections.find((s) => s.type === 'general');
  const hero = sections.find((s) => s.type === 'hero');
  const features = sections.find((s) => s.type === 'features');
  const testimonials = sections.find((s) => s.type === 'testimonials');
  const pricing = sections.find((s) => s.type === 'pricing');
  const footer = sections.find((s) => s.type === 'footer');

  const sectionToggle = (section: Section) => (
    <Toggle
      checked={section.enabled}
      onChange={(enabled) => onToggleSection(section.id, enabled)}
    />
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          Secciones
        </h2>

        {/* General — always visible, no toggle */}
        {general && (
          <Accordion title="General" icon="⚙️" defaultOpen>
            <GeneralSection
              data={general.data as GeneralData}
              onChange={(data) => onSectionChange(general.id, data)}
            />
          </Accordion>
        )}

        {/* Hero */}
        {hero && (
          <Accordion title="Hero" icon="🦸" action={sectionToggle(hero)}>
            <HeroSection
              data={hero.data as HeroData}
              onChange={(data) => onSectionChange(hero.id, data)}
            />
          </Accordion>
        )}

        {/* Features */}
        {features && (
          <Accordion title="Features" icon="✨" action={sectionToggle(features)}>
            <FeaturesSection
              data={features.data as FeaturesData}
              onChange={(data) => onSectionChange(features.id, data)}
            />
          </Accordion>
        )}

        {/* Testimonials */}
        {testimonials && (
          <Accordion title="Testimonios" icon="💬" action={sectionToggle(testimonials)}>
            <TestimonialsSection
              data={testimonials.data as TestimonialsData}
              onChange={(data) => onSectionChange(testimonials.id, data)}
            />
          </Accordion>
        )}

        {/* Pricing */}
        {pricing && (
          <Accordion title="Precios" icon="💰" action={sectionToggle(pricing)}>
            <PricingSection
              data={pricing.data as PricingData}
              onChange={(data) => onSectionChange(pricing.id, data)}
            />
          </Accordion>
        )}

        {/* Footer */}
        {footer && (
          <Accordion title="Footer" icon="📄" action={sectionToggle(footer)}>
            <FooterSection
              data={footer.data as FooterData}
              onChange={(data) => onSectionChange(footer.id, data)}
            />
          </Accordion>
        )}
      </div>

      {/* Action buttons */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <Button
          variant="secondary"
          className="w-full"
          onClick={onSave}
          loading={isSaving}
        >
          💾 Guardar borrador
        </Button>
        <Button
          variant="primary"
          className="w-full"
          onClick={onPublish}
          loading={isPublishing}
        >
          🚀 Publicar
        </Button>
      </div>
    </div>
  );
}
