// hooks/useAuth.tsx

"use client";

// hooks/useAuth.tsx

import { useEffect, useState, createContext, useContext } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { SystemUser } from '@/types/models';
import { doc, getDoc, setDoc, serverTimestamp, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface AuthContextProps {
  user: FirebaseUser | null;
  systemUser: SystemUser | null;
  loading: boolean; // ローディング状態を追加
}

const AuthContext = createContext<AuthContextProps>({ user: null, systemUser: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [systemUser, setSystemUser] = useState<SystemUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // systemUserドキュメントを取得または作成
        const userRef = doc(db, 'systemUsers', firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        let fetchedSystemUser: SystemUser;

        if (userSnap.exists()) {
          fetchedSystemUser = userSnap.data() as SystemUser;
        } else {
          const newUser: SystemUser = {
            name: firebaseUser.displayName || '',
            email: firebaseUser.email || '',
            role: 'editor',
            associatedLineAccountIds: [],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          };
          await setDoc(userRef, newUser);
          fetchedSystemUser = newUser;
        }

        // superadminの場合、すべてのlineAccountsのIDを取得
        if (fetchedSystemUser.role === 'superadmin') {
          const accountsRef = collection(db, 'lineAccounts');
          const accountsSnapshot = await getDocs(accountsRef);
          const allAccountIds = accountsSnapshot.docs.map((doc) => doc.id);
          fetchedSystemUser.associatedLineAccountIds = allAccountIds;
        }

        setSystemUser(fetchedSystemUser);
      } else {
        setUser(null);
        setSystemUser(null);
      }
      setLoading(false); // ローディング完了
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, systemUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
