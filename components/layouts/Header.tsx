// app/components/layouts/Header.tsx

'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Menu } from 'lucide-react';

type HeaderProps = {
  onToggleSidebar: () => void;
  currentAccount: {
    id: string;
    accountName: string;
    isAdmin: boolean;
  };
  onAccountChange: (accountId: string) => void;
  availableAccounts: {
    id: string;
    accountName: string;
    isAdmin: boolean;
  }[];
};

export default function Header({ onToggleSidebar, currentAccount, onAccountChange, availableAccounts }: HeaderProps) {
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
        {/* 現在のアカウント名を表示 */}
        <Avatar>
          <AvatarImage src="/placeholder.svg" alt={currentAccount.accountName} />
          <AvatarFallback>{currentAccount.accountName.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="font-medium">{currentAccount.accountName}</span>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" aria-label="通知">
          <Bell className="h-4 w-4" />
        </Button>
        <Select value={currentAccount.id} onValueChange={onAccountChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="LINEアカウント選択" />
          </SelectTrigger>
          <SelectContent>
            {availableAccounts.map((account) => (
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
