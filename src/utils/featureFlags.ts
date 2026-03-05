import type { Plan, ModuleId } from '../types';

const PLAN_HIERARCHY: Record<Plan, number> = {
  free: 0,
  starter: 1,
  business: 2,
  enterprise: 3,
};

const MODULE_REQUIREMENTS: Record<ModuleId, Plan> = {
  'blog': 'starter',
  'ecommerce': 'business',
  'booking': 'enterprise',
  'analytics': 'starter',
  'contact-form': 'free',
};

export function isModuleAvailable(moduleId: ModuleId, currentPlan: Plan): boolean {
  const required = MODULE_REQUIREMENTS[moduleId] ?? 'free';
  return PLAN_HIERARCHY[currentPlan] >= PLAN_HIERARCHY[required];
}

export function getRequiredPlan(moduleId: ModuleId): Plan {
  return MODULE_REQUIREMENTS[moduleId] ?? 'free';
}
