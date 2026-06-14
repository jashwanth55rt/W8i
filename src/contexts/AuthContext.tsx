import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  dbUser: any | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, isAdmin: false, dbUser: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<any | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubUserDoc: (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      // Unsubscribe from any previous user document snapshot listener
      if (unsubUserDoc) {
        unsubUserDoc();
        unsubUserDoc = null;
      }

      if (firebaseUser) {
        setUser(firebaseUser);
        
        try {
          // Fetch admin role and initial user profile document in parallel
          const adminDocPromise = getDoc(doc(db, 'admins', firebaseUser.uid));
          const userDocPromise = getDoc(doc(db, 'users', firebaseUser.uid));
          
          const [adminDoc, userDoc] = await Promise.all([adminDocPromise, userDocPromise]);
          
          // Determine if admin
          const adminExists = adminDoc.exists() || firebaseUser.email === 'malleshr20944@gmail.com';
          setIsAdmin(adminExists);
          
          // Set initial user data
          if (userDoc.exists()) {
            setDbUser({ id: userDoc.id, ...userDoc.data() });
          } else {
            setDbUser(null);
          }
          
          // Done loading initial security & identity state!
          setLoading(false);
          
          // Set up real-time listener to keep user profile in sync in the background
          unsubUserDoc = onSnapshot(doc(db, 'users', firebaseUser.uid), (userSnap) => {
            if (userSnap.exists()) {
              setDbUser({ id: userSnap.id, ...userSnap.data() });
            } else {
              setDbUser(null);
            }
          }, (error) => {
            console.error("Error listening to user document in background:", error);
          });
          
        } catch (error) {
          console.error("Error during auth initial data fetch:", error);
          // Fallback check to avoid locking out the owner email
          setIsAdmin(firebaseUser.email === 'malleshr20944@gmail.com');
          setLoading(false);
        }
      } else {
        setUser(null);
        setDbUser(null);
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => {
      unsubAuth();
      if (unsubUserDoc) {
        unsubUserDoc();
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, dbUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
