// app/layout.tsx

'use client'; // 必要に応じて追加

import '@/globals.css'; // グローバルCSSのインポート
import { AuthProvider } from '@/hooks/useAuth';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
