'use client';
import { createContext, useContext, useState, type ReactNode } from 'react';

interface EarlyAccessContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const EarlyAccessContext = createContext<EarlyAccessContextValue | null>(null);

export function EarlyAccessProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <EarlyAccessContext.Provider value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }}>
      {children}
    </EarlyAccessContext.Provider>
  );
}

export function useEarlyAccess() {
  const ctx = useContext(EarlyAccessContext);
  if (!ctx) throw new Error('useEarlyAccess must be used inside EarlyAccessProvider');
  return ctx;
}
