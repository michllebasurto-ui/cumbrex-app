// ─── Auth ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'editor' | 'viewer';
  tenantId: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  subdomain?: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  companyName: string;
  subdomain: string;
  template: string;
  plan: string;
}

// ─── Tenant ──────────────────────────────────────────────────────────────────

export type Plan = 'free' | 'starter' | 'business' | 'enterprise';

export interface TenantConfig {
  id: string;
  name: string;
  subdomain: string;
  customDomain?: string;
  plan: Plan;
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
  faviconUrl?: string;
}

// ─── Content ─────────────────────────────────────────────────────────────────

export type SectionType =
  | 'general'
  | 'hero'
  | 'features'
  | 'testimonials'
  | 'pricing'
  | 'footer';

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface TestimonialItem {
  quote: string;
  author: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  features: string[];
  ctaText: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface GeneralData {
  name: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
}

export interface HeroData {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
}

export interface FeaturesData {
  title: string;
  items: FeatureItem[];
}

export interface TestimonialsData {
  title: string;
  items: TestimonialItem[];
}

export interface PricingData {
  title: string;
  plans: PricingPlan[];
}

export interface FooterData {
  text: string;
  links: FooterLink[];
}

export type SectionData =
  | GeneralData
  | HeroData
  | FeaturesData
  | TestimonialsData
  | PricingData
  | FooterData;

export interface Section {
  id: string;
  type: SectionType;
  enabled: boolean;
  data: SectionData;
}

export interface Page {
  id: string;
  tenantId: string;
  title: string;
  slug: string;
  sections: Section[];
  publishedAt?: string;
  updatedAt: string;
}

// ─── Modules ─────────────────────────────────────────────────────────────────

export type ModuleId =
  | 'blog'
  | 'ecommerce'
  | 'booking'
  | 'analytics'
  | 'contact-form';

export interface Module {
  id: ModuleId;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  requiredPlan: Plan;
}

// ─── postMessage ─────────────────────────────────────────────────────────────

export interface PostMessageUpdateColors {
  type: 'UPDATE_COLORS';
  payload: { primaryColor: string; secondaryColor: string };
}

export interface PostMessageUpdateComponent {
  type: 'UPDATE_COMPONENT';
  payload: { componentType: string; data: Record<string, unknown> };
}

export interface PostMessageToggleComponent {
  type: 'TOGGLE_COMPONENT';
  payload: { componentType: string; visible: boolean };
}

export type PostMessageOut =
  | PostMessageUpdateColors
  | PostMessageUpdateComponent
  | PostMessageToggleComponent;
