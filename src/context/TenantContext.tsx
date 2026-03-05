/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { TenantConfig } from '../types';
import { getTenantConfig } from '../api/tenant';
import { detectTenant } from '../utils/tenant';

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_TENANTS: Record<string, TenantConfig> = {
  acme: {
    id: 'tenant-acme',
    name: 'Acme Corp',
    subdomain: 'acme',
    plan: 'starter',
    primaryColor: '#2563EB',
    secondaryColor: '#7C3AED',
    logoUrl: '',
  },
  globex: {
    id: 'tenant-globex',
    name: 'Globex Inc',
    subdomain: 'globex',
    plan: 'business',
    primaryColor: '#059669',
    secondaryColor: '#D97706',
    logoUrl: '',
  },
};

const DEFAULT_TENANT: TenantConfig = {
  id: 'tenant-default',
  name: 'Mi Empresa',
  subdomain: 'demo',
  plan: 'free',
  primaryColor: '#2563EB',
  secondaryColor: '#7C3AED',
  logoUrl: '',
};

// ─── Context types ────────────────────────────────────────────────────────────

export interface TenantContextValue {
  tenant: TenantConfig | null;
  subdomain: string | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const TenantContext = createContext<TenantContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenant, setTenant] = useState<TenantConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const subdomain = detectTenant();

  const fetchTenant = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const config = await getTenantConfig();
      setTenant(config);
    } catch {
      // Mock mode fallback
      if (subdomain && MOCK_TENANTS[subdomain]) {
        setTenant(MOCK_TENANTS[subdomain]);
      } else {
        setTenant(DEFAULT_TENANT);
      }
    } finally {
      setIsLoading(false);
    }
  }, [subdomain]);

  useEffect(() => {
    void fetchTenant();
  }, [fetchTenant]);

  const value: TenantContextValue = {
    tenant,
    subdomain,
    isLoading,
    error,
    refetch: fetchTenant,
  };

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}
