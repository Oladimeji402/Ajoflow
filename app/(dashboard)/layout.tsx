import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Dashboard',
    template: '%s | Subtech Ajo Solution',
  },
  robots: { index: false, follow: false, nocache: true },
};

export default function DashboardRootLayout({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
