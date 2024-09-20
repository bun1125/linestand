// app/context/AccountContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { LineAccount } from "@/types/models";
import { db } from "@/lib/firebase"; // 修正: 'db' をインポート
import { useAuth } from "@/hooks/useAuth";
import { onSnapshot, collection, query, where } from 'firebase/firestore';

type AccountContextType = {
  currentAccount: LineAccount | null;
  switchAccount: (accountId: string) => void;
  availableAccounts: LineAccount[];
};

export const AccountContext = createContext<AccountContextType>({
  currentAccount: null,
  switchAccount: () => {},
  availableAccounts: [],
});

type AccountProviderProps = {
  children: ReactNode;
};

export const AccountProvider = ({ children }: AccountProviderProps) => {
  const { user } = useAuth();
  const [availableAccounts, setAvailableAccounts] = useState<LineAccount[]>([]);
  const [currentAccount, setCurrentAccount] = useState<LineAccount | null>(null);

  useEffect(() => {
    if (!user) {
      setAvailableAccounts([]);
      setCurrentAccount(null);
      return;
    }

    const accountsRef = collection(db, 'lineAccounts'); // 修正: 'db' を使用
    const q = query(accountsRef, where('users', 'array-contains', user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const accounts: LineAccount[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<LineAccount, 'id'>)
      }));
      setAvailableAccounts(accounts);
      if (accounts.length > 0 && !currentAccount) {
        setCurrentAccount(accounts[0]); // 最初に取得したアカウントを自動で設定
      }
    }, (error) => {
      console.error("アカウントの取得に失敗しました:", error);
    });

    return () => unsubscribe();
  }, [user]);

  const switchAccount = (accountId: string) => {
    const account = availableAccounts.find(acc => acc.id === accountId) || null;
    setCurrentAccount(account);
  };

  return (
    <AccountContext.Provider value={{ currentAccount, switchAccount, availableAccounts }}>
      {children}
    </AccountContext.Provider>
  );
};
