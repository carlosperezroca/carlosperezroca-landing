'use client';

import dynamic from 'next/dynamic';

const LandingClient = dynamic(
  () => import('./landing-client').then((m) => m.LandingClient),
  { ssr: false }
);

export function LandingLoader() {
  return <LandingClient />;
}
