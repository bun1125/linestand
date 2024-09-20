// app/components/layouts/DashboardLayout.tsx

'use client';

import React, { useState, useContext } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { AccountContext } from "@/context/AccountContext";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { currentAccount, availableAccounts, switchAccount } = useContext(AccountContext);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const handleAccountChange = (accountId: string) => {
    switchAccount(accountId);
  };

  if (!currentAccount) {
    return <div>アカウントが選択されていません。</div>;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-green-50 to-pink-50">
      <Sidebar
        isAdmin={currentAccount.isAdmin}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
      />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <Header
          onToggleSidebar={toggleSidebar}
          currentAccount={currentAccount}
          onAccountChange={handleAccountChange}
          availableAccounts={availableAccounts}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
