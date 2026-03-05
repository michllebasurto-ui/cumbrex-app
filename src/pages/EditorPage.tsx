import { useState, useRef, useEffect, useCallback } from 'react';
import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { EditorPanel } from '../components/editor/EditorPanel';
import { useTenant } from '../hooks/useTenant';
import { useToast } from '../components/ui/Toast';
import { saveSections, publishPage } from '../api/content';
import type { Section, GeneralData } from '../types';

const LANDING_URL = import.meta.env.VITE_LANDING_URL ?? 'http://localhost:4321';

// ─── Default sections ────────────────────────────────────────────────────────

const DEFAULT_SECTIONS: Section[] = [
  {
    id: 'general',
    type: 'general',
    enabled: true,
    data: {
      name: 'Mi Empresa',
      logoUrl: '',
      primaryColor: '#2563EB',
      secondaryColor: '#7C3AED',
    },
  },
  {
    id: 'hero',
    type: 'hero',
    enabled: true,
    data: {
      title: 'Bienvenido a nuestra empresa',
      subtitle: 'Descripción breve de tu propuesta de valor',
      ctaText: 'Comenzar ahora',
      ctaHref: '#contacto',
    },
  },
  {
    id: 'features',
    type: 'features',
    enabled: true,
    data: {
      title: 'Nuestras características',
      items: [
        { icon: '⚡', title: 'Rápido', description: 'Carga en menos de 1 segundo' },
        { icon: '🔒', title: 'Seguro', description: 'SSL y datos encriptados' },
        { icon: '📱', title: 'Responsive', description: 'Perfecto en cualquier pantalla' },
      ],
    },
  },
  {
    id: 'testimonials',
    type: 'testimonials',
    enabled: true,
    data: {
      title: 'Lo que dicen nuestros clientes',
      items: [
        { quote: 'Excelente servicio, muy recomendado.', author: 'Juan Pérez, CEO' },
        { quote: 'Nos ayudó a crecer un 300% en ventas.', author: 'María García, Directora' },
      ],
    },
  },
  {
    id: 'pricing',
    type: 'pricing',
    enabled: false,
    data: {
      title: 'Nuestros planes',
      plans: [
        { name: 'Basic', price: '$0/mes', features: ['Feature 1', 'Feature 2'], ctaText: 'Comenzar gratis' },
        { name: 'Pro', price: '$29/mes', features: ['Todo lo de Basic', 'Feature 3', 'Soporte'], ctaText: 'Contratar' },
      ],
    },
  },
  {
    id: 'footer',
    type: 'footer',
    enabled: true,
    data: {
      text: '© 2025 Mi Empresa. Todos los derechos reservados.',
      links: [
        { label: 'Política de privacidad', href: '/privacidad' },
        { label: 'Términos de uso', href: '/terminos' },
      ],
    },
  },
];

type Viewport = 'desktop' | 'tablet' | 'mobile';

const VIEWPORT_WIDTHS: Record<Viewport, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
};

// ─── Component ────────────────────────────────────────────────────────────────

export function EditorPage() {
  const { tenant, subdomain } = useTenant();
  const { toast } = useToast();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const sectionsRef = useRef<Section[]>([]);

  const [sections, setSections] = useState<Section[]>(() => {
    const stored = localStorage.getItem('editor_sections');
    if (stored) {
      try { return JSON.parse(stored) as Section[]; } catch { /* ignore */ }
    }
    return DEFAULT_SECTIONS;
  });

  // Keep ref in sync with state
  sectionsRef.current = sections;

  const [viewport, setViewport] = useState<Viewport>('desktop');
  const [previewReady, setPreviewReady] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const previewUrl = `${LANDING_URL}/preview?tenant=${subdomain ?? tenant?.subdomain ?? 'demo'}`;

  const sendToIframe = useCallback((message: object) => {
    iframeRef.current?.contentWindow?.postMessage(message, LANDING_URL);
  }, []);

  const sendAllToIframe = useCallback((sects: Section[]) => {
    const general = sects.find((s) => s.type === 'general');
    if (general) {
      const g = general.data as GeneralData;
      sendToIframe({
        type: 'UPDATE_COLORS',
        payload: { primaryColor: g.primaryColor, secondaryColor: g.secondaryColor },
      });
      sendToIframe({
        type: 'UPDATE_COMPONENT',
        payload: { componentType: 'general', data: g },
      });
    }
    sects.filter((s) => s.type !== 'general').forEach((s) => {
      sendToIframe({
        type: 'UPDATE_COMPONENT',
        payload: { componentType: s.type, data: s.data },
      });
      sendToIframe({
        type: 'TOGGLE_COMPONENT',
        payload: { componentType: s.type, visible: s.enabled },
      });
    });
  }, [sendToIframe]);

  // Listen for PREVIEW_READY from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'PREVIEW_READY') {
        setPreviewReady(true);
        sendAllToIframe(sectionsRef.current);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [sendAllToIframe]);

  const handleSectionChange = (sectionId: string, data: Section['data']) => {
    setSections((prev) => {
      const updated = prev.map((s) => (s.id === sectionId ? { ...s, data } : s));

      // Send postMessage for real-time update
      const section = updated.find((s) => s.id === sectionId);
      if (section) {
        if (section.type === 'general') {
          const g = data as GeneralData;
          sendToIframe({
            type: 'UPDATE_COLORS',
            payload: { primaryColor: g.primaryColor, secondaryColor: g.secondaryColor },
          });
        }
        sendToIframe({
          type: 'UPDATE_COMPONENT',
          payload: { componentType: section.type, data },
        });
      }
      return updated;
    });
  };

  const handleToggleSection = (sectionId: string, enabled: boolean) => {
    setSections((prev) => {
      const updated = prev.map((s) => (s.id === sectionId ? { ...s, enabled } : s));
      const section = updated.find((s) => s.id === sectionId);
      if (section) {
        sendToIframe({
          type: 'TOGGLE_COMPONENT',
          payload: { componentType: section.type, visible: enabled },
        });
      }
      return updated;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSections('main', sections);
      toast('Borrador guardado correctamente', 'success');
    } catch {
      // Mock mode: save to localStorage
      localStorage.setItem('editor_sections', JSON.stringify(sections));
      toast('Borrador guardado localmente (modo mock)', 'success');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await publishPage('main');
      toast('¡Página publicada exitosamente! 🎉', 'success');
    } catch {
      localStorage.setItem('editor_sections', JSON.stringify(sections));
      toast('Cambios guardados en modo mock. ¡Listo para publicar! 🚀', 'success');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 shrink-0">
        <h1 className="font-semibold text-gray-800 text-sm">
          🖥️ Editor de Landing Page
          {tenant && (
            <span className="text-gray-400 font-normal ml-1">— {tenant.name}</span>
          )}
        </h1>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {([ 
            { id: 'desktop', icon: <Monitor size={16} />, label: 'Escritorio' },
            { id: 'tablet', icon: <Tablet size={16} />, label: 'Tablet' },
            { id: 'mobile', icon: <Smartphone size={16} />, label: 'Móvil' },
          ] as const).map((v) => (
            <button
              key={v.id}
              onClick={() => setViewport(v.id)}
              title={v.label}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                viewport === v.id
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {v.icon}
              <span className="hidden sm:inline">{v.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Editor layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel */}
        <div className="w-96 shrink-0 border-r border-gray-200 bg-white overflow-hidden flex flex-col">
          <EditorPanel
            sections={sections}
            onSectionChange={handleSectionChange}
            onToggleSection={handleToggleSection}
            onSave={handleSave}
            onPublish={handlePublish}
            isSaving={isSaving}
            isPublishing={isPublishing}
          />
        </div>

        {/* Right panel: iframe */}
        <div className="flex-1 bg-gray-100 overflow-auto flex flex-col items-center">
          {!previewReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 z-10 pointer-events-none">
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
                <p className="text-sm text-gray-500">Cargando preview…</p>
              </div>
            </div>
          )}
          <div
            className="relative h-full transition-all duration-300"
            style={{ width: VIEWPORT_WIDTHS[viewport] }}
          >
            <iframe
              ref={iframeRef}
              src={previewUrl}
              className="w-full h-full border-0 bg-white"
              title="Preview de landing page"
              onLoad={() => {
                // If PREVIEW_READY doesn't fire (e.g., non-Astro page), mark ready after load
                setTimeout(() => setPreviewReady(true), 500);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
