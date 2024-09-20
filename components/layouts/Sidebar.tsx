// app/components/layouts/Sidebar.tsx

'use client';

import React, { useState, useEffect, useContext } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LayoutDashboard, MessageCircle, Mail, BarChart2, Users, Menu, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { AccountContext } from '@/context/AccountContext';

type SidebarProps = {
  isOpen: boolean;
  onToggle: () => void;
  isAdmin: boolean;
};

export default function Sidebar({ isOpen, onToggle, isAdmin }: SidebarProps) {
  const { currentAccount } = useContext(AccountContext);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!currentAccount) {
    return null;
  }

  const menuItems = [
    { href: `/${currentAccount.id}/dashboard`, icon: LayoutDashboard, label: 'ダッシュボード' },
    { href: `/${currentAccount.id}/chat`, icon: MessageCircle, label: 'チャット' },
    { href: `/${currentAccount.id}/message`, icon: Mail, label: 'メッセージ' },
    { href: `/${currentAccount.id}/reader-analysis`, icon: BarChart2, label: 'リーダー分析' },
    { href: `/${currentAccount.id}/message-analysis`, icon: BarChart2, label: 'メッセージ分析' },
    ...(isAdmin ? [{ href: '/admin', icon: Users, label: '管理者ページ' }] : []),
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 flex items-center justify-between">
        <Avatar className="w-10 h-10">
          <AvatarImage src="/placeholder.svg" alt="LINESTAND" />
          <AvatarFallback>LS</AvatarFallback>
        </Avatar>
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            aria-label={isOpen ? "サイドバーを閉じる" : "サイドバーを開く"}
          >
            {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        )}
      </div>
      <nav className="flex-grow">
        <ul className="flex flex-col space-y-2 p-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className={`flex items-center p-2 space-x-2 rounded-md hover:bg-gray-100 ${!isOpen && 'justify-center'}`}
              >
                <item.icon className="w-5 h-5" aria-hidden="true" />
                {/* サイドバーが開いているか、モバイルの場合のみテキストを表示 */}
                {(isOpen || isMobile) && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onToggle}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="fixed top-4 left-4 z-50" aria-label="メニューを開く">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside className={`bg-white border-r transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-16'} flex flex-col z-40`}>
      <SidebarContent />
    </aside>
  );
}
