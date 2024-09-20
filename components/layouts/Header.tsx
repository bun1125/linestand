// components/ui/Header.tsx

'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Menu } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLineAccounts } from '@/hooks/useLineAccounts';

type HeaderProps = {
  onToggleSidebar: () => void;
};

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { user, systemUser } = useAuth();
  const { lineAccounts, selectedAccountId, setSelectedAccountId } = useLineAccounts(systemUser);

  if (!user || !systemUser) {
    return null; // 認証されていない場合は何も表示しない
  }

  return (
    <header className="flex items-center justify-between p-4 bg-white border-b sticky top-0 z-20">
      <Button
        variant="outline"
        size="icon"
        className="lg:hidden"
        onClick={onToggleSidebar}
        aria-label="メニューを開く"
      >
        <Menu className="h-5 w-5" />
      </Button>
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={user.photoURL || ''} alt={systemUser.name} />
          <AvatarFallback>{systemUser.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="font-medium">{systemUser.name}</span>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" aria-label="通知">
          <Bell className="h-4 w-4" />
        </Button>
        <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="LINEアカウント選択" />
          </SelectTrigger>
          <SelectContent>
            {lineAccounts.map((account) => (
              <SelectItem key={account.id} value={account.id}>
                {account.accountName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </header>
  );
}
