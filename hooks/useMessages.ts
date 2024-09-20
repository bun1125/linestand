// hooks/useMessages.ts

import { useEffect, useState } from 'react';
import { UserMessage } from '@/types/models';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const useMessages = (accountId: string, userId: string | undefined) => {
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accountId || !userId) return;

    const messagesRef = collection(db, 'lineAccounts', accountId, 'users', userId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages: UserMessage[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<UserMessage, 'id'>),
      }));
      setMessages(fetchedMessages);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching messages:", err);
      setError("メッセージの取得に失敗しました。");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [accountId, userId]);

  return {
    messages,
    loading,
    error,
  };
};
