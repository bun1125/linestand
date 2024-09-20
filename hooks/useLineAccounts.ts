// hooks/useLineAccounts.ts

import { useEffect, useState } from 'react';
import { SystemUser, LineAccount } from '@/types/models';
import { getLineAccounts } from '@/services/firestore';

export const useLineAccounts = (systemUser: SystemUser | null) => {
  const [lineAccounts, setLineAccounts] = useState<LineAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');

  useEffect(() => {
    if (!systemUser) return;

    const fetchLineAccounts = async () => {
      const accounts = await getLineAccounts(systemUser.associatedLineAccountIds);
      setLineAccounts(accounts);
      if (accounts.length > 0) {
        setSelectedAccountId(accounts[0].id);
      }
    };

    fetchLineAccounts();
  }, [systemUser]);

  return { lineAccounts, selectedAccountId, setSelectedAccountId };
};
