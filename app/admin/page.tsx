// app/admin/page.tsx

'use client';

import AddLineAccount from '@/components/admin/AddLineAccount';
import { useAuth } from '@/hooks/useAuth';

export default function AdminPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>認証が必要です。</p>;
  }

  // 管理者の権限チェック（必要に応じて実装）

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">管理者ページ</h1>
      <AddLineAccount />
      {/* 他の管理者向けコンポーネントをここに追加 */}
    </div>
  );
}
