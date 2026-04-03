import './globals.css';
import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';

export const metadata: Metadata = {
  title: 'Carlos Pérez Roca',
  description:
    'Frontend, producto y experiencias web con criterio, claridad y atención al detalle.',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
