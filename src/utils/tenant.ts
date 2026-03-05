/**
 * Extracts the subdomain from the current hostname.
 * - Production: clienteA.cumbrex.lat → "clienteA"
 * - Development: localhost:5173/app?tenant=acme → "acme"
 */
export function extractSubdomain(hostname: string): string | null {
  const parts = hostname.split('.');
  if (parts.length >= 3) return parts[0];
  return null;
}

export function detectTenant(): string | null {
  // 1. Query param ?tenant=
  const params = new URLSearchParams(window.location.search);
  const tenantParam = params.get('tenant');
  if (tenantParam) return tenantParam;

  // 2. Subdomain
  const host = window.location.hostname;
  return extractSubdomain(host);
}
