import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';

interface AccordionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  icon?: string;
  action?: ReactNode;
}

export function Accordion({
  title,
  children,
  defaultOpen = false,
  icon,
  action,
}: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <span className="flex items-center gap-2 font-medium text-gray-800 text-sm">
          {icon && <span>{icon}</span>}
          {title}
        </span>
        <span className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {action}
          <ChevronDown
            size={16}
            className={`text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </span>
      </button>
      {open && <div className="px-4 py-3 space-y-3 bg-white">{children}</div>}
    </div>
  );
}
