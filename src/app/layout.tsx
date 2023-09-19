import './globals.css';
import { NavLinks } from '@/components/NavLinks';
import React from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <nav>
          <NavLinks />
        </nav>
        {children}
        <footer>
          <NavLinks />
        </footer>
      </body>
    </html>
  );
}
