// app/auth/login/page.tsx

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { user, systemUser, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user && systemUser) {
        if (systemUser.associatedLineAccountIds && systemUser.associatedLineAccountIds.length > 0) {
          const firstAccountId = systemUser.associatedLineAccountIds[0];
          // 新しいURLパスにリダイレクト
          router.push(`/${firstAccountId}/dashboard`);
        } else {
          // アカウントがない場合の処理（例: エラーページに遷移）
          router.push('/no-account');
        }
      }
    }
  }, [user, systemUser, loading]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('ログインエラー:', error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-400 via-pink-300 to-purple-400">
      <Card className="w-full max-w-4xl overflow-hidden rounded-xl shadow-2xl">
        {/* 既存のコードはそのまま */}
        <div className="grid md:grid-cols-2">
          <div className="p-8 md:p-12">
            <CardHeader className="space-y-1">
              <CardTitle className="text-3xl font-bold tracking-tight">ログイン</CardTitle>
              <CardDescription>社内向けLINE配信スタンドへようこそ</CardDescription>
            </CardHeader>
            <CardContent className="mt-10">
              <Button className="w-full" variant="outline" onClick={handleLogin}>
                <Icons.google className="mr-2 h-4 w-4" />
                Googleでログイン
              </Button>
            </CardContent>
          </div>
          {/* 残りのコードは省略 */}
        </div>
      </Card>
    </div>
  );
}
