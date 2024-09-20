// app/layout.tsx

'use client'; // 必要に応じて追加

import '@/globals.css'; // グローバルCSSのインポート
import { AuthProvider } from '@/hooks/useAuth';
import { AccountProvider } from '@/context/AccountContext';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <AuthProvider>
          <AccountProvider>
            <DashboardLayout>
              {children}
            </DashboardLayout>
          </AccountProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
