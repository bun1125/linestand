'use client';

import '@/globals.css';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import SidebarComponent from '@/components/layouts/Sidebar';
import Header from '@/components/layouts/Header';
import { useState, useEffect } from 'react';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { systemUser, loading } = useAuth();
  const isAdmin = systemUser?.role === 'superadmin';
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!systemUser) {
    return <p>認証が必要です。</p>;
  }

  return (
    <AuthProvider>
      <div className="flex h-screen overflow-hidden">
        {/* サイドバー */}
        <SidebarComponent isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} isAdmin={isAdmin} />

        {/* メインコンテンツ */}
        <div className="flex-1 flex flex-col">
          {/* ヘッダー */}
          <Header onToggleSidebar={toggleSidebar} />

          {/* オーバーレイ（モバイルのみ、サイドバーが開いている時） */}
          {isMobile && isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-30"
              onClick={toggleSidebar}
            ></div>
          )}

          {/* コンテンツ */}
          <main className="flex-1 overflow-auto transition-all duration-300 ease-in-out">
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
