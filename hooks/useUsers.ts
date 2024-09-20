// hooks/useUsers.ts

import { useEffect, useState } from 'react';
import { User } from '@/types/models';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getUserById } from '@/services/firestore';

export const useUsers = (accountId: string) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accountId) return;

    const usersRef = collection(db, 'lineAccounts', accountId, 'users');
    const q = query(usersRef, orderBy('lastMessageAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedUsers: User[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<User, 'id'>),
      }));
      setUsers(fetchedUsers);
      if (!selectedUser && fetchedUsers.length > 0) {
        setSelectedUser(fetchedUsers[0]);
      }
      setLoading(false);
    }, (err) => {
      console.error("Error fetching users:", err);
      setError("ユーザーの取得に失敗しました。");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [accountId, selectedUser]);

  const selectUserById = (userId: string) => {
    const user = users.find(u => u.id === userId) || null;
    setSelectedUser(user);
  };

  return {
    users,
    selectedUser,
    selectUserById,
    setSelectedUser,
    loading,
    error,
  };
};
