// services/firestore.ts

import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, query, where, orderBy, addDoc, updateDoc, arrayUnion, arrayRemove, serverTimestamp } from 'firebase/firestore';
import { LineAccount, SystemUser, Scenario, User, UserMessage } from '@/types/models';

/**
 * systemUsersコレクションからシステムユーザーを取得
 */
export const getSystemUser = async (uid: string): Promise<SystemUser | null> => {
  const userRef = doc(db, 'systemUsers', uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return { id: userSnap.id, ...(userSnap.data() as SystemUser) };
  }
  return null;
};

/**
 * ユーザーに関連するLineAccountのリストを取得
 */
export const getLineAccounts = async (lineAccountIds: string[]): Promise<LineAccount[]> => {
  if (lineAccountIds.length === 0) return [];
  const accountsRef = collection(db, 'lineAccounts');
  const q = query(accountsRef, where('__name__', 'in', lineAccountIds));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as LineAccount),
  }));
};

/**
 * 特定のLineAccountのシナリオを取得
 */
export const getScenarios = async (accountId: string): Promise<Scenario[]> => {
  const scenariosRef = collection(db, 'lineAccounts', accountId, 'scenarios');
  const scenariosSnap = await getDocs(scenariosRef);
  return scenariosSnap.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Scenario),
  }));
};

/**
 * 特定のLineAccountのKPIデータを取得（例として）
 */
export const getKPIData = async (accountId: string, period: string): Promise<any> => {
    // 実際のKPIデータ取得ロジックを実装します
    // 例として、lineAccountsコレクションからデータを取得
    const accountRef = doc(db, 'lineAccounts', accountId);
    const accountSnap = await getDoc(accountRef);
    if (accountSnap.exists()) {
      const accountData = accountSnap.data() as LineAccount;
      // KPIデータの計算をここで行います
      return {
        // 仮のデータ
        friendsAdded: 150,
        cpa: 500,
        // 他のKPI...
      };
    }
    return null;
  };

/**
 * ユーザー一覧を取得
 */
export const getUsers = async (accountId: string): Promise<User[]> => {
  const usersRef = collection(db, 'lineAccounts', accountId, 'users');
  const q = query(usersRef, orderBy('lastMessageAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as User),
  }));
};

/**
 * 特定のユーザーを取得
 */
export const getUserById = async (accountId: string, userId: string): Promise<User | null> => {
  const userRef = doc(db, 'lineAccounts', accountId, 'users', userId);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return { id: userSnap.id, ...(userSnap.data() as User) };
  }
  return null;
};

/**
 * ユーザーのメッセージ一覧を取得
 */
export const getUserMessages = async (accountId: string, userId: string): Promise<UserMessage[]> => {
  const messagesRef = collection(db, 'lineAccounts', accountId, 'users', userId, 'messages');
  const q = query(messagesRef, orderBy('timestamp', 'asc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as UserMessage),
  }));
};

/**
 * メッセージの送信
 */
export const sendMessage = async (
  accountId: string,
  userId: string,
  message: Omit<UserMessage, 'id'>
): Promise<void> => {
  const messagesRef = collection(db, 'lineAccounts', accountId, 'users', userId, 'messages');
  await addDoc(messagesRef, {
    ...message,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // ユーザーの lastMessageAt を更新
  const userRef = doc(db, 'lineAccounts', accountId, 'users', userId);
  await updateDoc(userRef, {
    lastMessageAt: serverTimestamp(),
  });
};

/**
 * タグの追加
 */
export const addTag = async (
  accountId: string,
  userId: string,
  tag: string
): Promise<void> => {
  const userRef = doc(db, 'lineAccounts', accountId, 'users', userId);
  await updateDoc(userRef, {
    tags: arrayUnion(tag),
    updatedAt: serverTimestamp(),
  });
};

/**
 * タグの削除
 */
export const removeTag = async (
  accountId: string,
  userId: string,
  tag: string
): Promise<void> => {
  const userRef = doc(db, 'lineAccounts', accountId, 'users', userId);
  await updateDoc(userRef, {
    tags: arrayRemove(tag),
    updatedAt: serverTimestamp(),
  });
};

/**
 * ステータスの更新
 */
export const updateStatus = async (
  accountId: string,
  userId: string,
  statusId: string
): Promise<void> => {
  const userRef = doc(db, 'lineAccounts', accountId, 'users', userId);
  await updateDoc(userRef, {
    statusId,
    updatedAt: serverTimestamp(),
  });
};

/**
 * メモの更新
 */
export const updateMemo = async (
  accountId: string,
  userId: string,
  memo: string
): Promise<void> => {
  const userRef = doc(db, 'lineAccounts', accountId, 'users', userId);
  await updateDoc(userRef, {
    notes: memo,
    updatedAt: serverTimestamp(),
  });
};

/**
 * ピンの切り替え
 */
export const togglePin = async (
  accountId: string,
  userId: string,
  isPinned: boolean
): Promise<void> => {
  const userRef = doc(db, 'lineAccounts', accountId, 'users', userId);
  await updateDoc(userRef, {
    pin: isPinned,
    updatedAt: serverTimestamp(),
  });
};

/**
 * 売上の更新
 */
export const updateSales = async (
  accountId: string,
  userId: string,
  sales: number
): Promise<void> => {
  const userRef = doc(db, 'lineAccounts', accountId, 'users', userId);
  await updateDoc(userRef, {
    sales,
    updatedAt: serverTimestamp(),
  });
};
