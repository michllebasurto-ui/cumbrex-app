import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Plan } from '../../types';

const PLAN_LABELS: Record<Plan, string> = {
  free: 'Free',
  starter: 'Starter',
  business: 'Business',
  enterprise: 'Enterprise',
};

interface LockedOverlayProps {
  requiredPlan: Plan;
}

export function LockedOverlay({ requiredPlan }: LockedOverlayProps) {
  return (
    <div className="absolute inset-0 rounded-xl bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2 z-10">
      <Lock size={24} className="text-gray-500" />
      <p className="text-sm font-medium text-gray-700 text-center px-4">
        Disponible en plan{' '}
        <span className="font-bold">{PLAN_LABELS[requiredPlan]}</span>
      </p>
      <Link
        to="/app/settings#plan"
        className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Upgrade
      </Link>
    </div>
  );
}
