'use client';
import { EarlyAccessProvider } from './EarlyAccessContext';
import EarlyAccessModal from './EarlyAccessModal';
import type { ReactNode } from 'react';

export default function EarlyAccessRoot({ children }: { children: ReactNode }) {
  return (
    <EarlyAccessProvider>
      {children}
      <EarlyAccessModal />
    </EarlyAccessProvider>
  );
}
