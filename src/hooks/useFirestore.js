import { useState, useEffect } from 'react';
import { db } from '../utils/firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';

export const useFirestore = (collectionName) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, collectionName));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setData(items);
      setLoading(false);
    });
    return unsubscribe;
  }, [collectionName]);

  return { data, loading };
};