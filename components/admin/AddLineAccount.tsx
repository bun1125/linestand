// components/admin/AddLineAccount.tsx

'use client';

import { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';

export default function AddLineAccount() {
  const { user } = useAuth();
  const [accountName, setAccountName] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setMessage('ユーザーが認証されていません。');
      return;
    }

    try {
      const db = getFirestore();
      await addDoc(collection(db, 'lineAccounts'), {
        userId: user.uid, // AuthProviderでユーザーIDが含まれている必要があります
        name: accountName,
      });
      setMessage('LINEアカウントが追加されました。');
      setAccountName('');
    } catch (error) {
      console.error('LINEアカウントの追加に失敗:', error);
      setMessage('LINEアカウントの追加に失敗しました。');
    }
  };

  return (
    <form onSubmit={handleAddAccount} className="space-y-4">
      <div>
        <label htmlFor="accountName" className="block text-sm font-medium text-gray-700">
          LINEアカウント名
        </label>
        <input
          type="text"
          id="accountName"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md">
        追加
      </button>
      {message && <p className="text-sm text-green-600">{message}</p>}
    </form>
  );
}
