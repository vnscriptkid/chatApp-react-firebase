import { getAuth, onAuthStateChanged } from "@firebase/auth";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  setDoc,
  where,
  query,
  getDoc,
} from "@firebase/firestore";
import { useEffect, useState } from "react";
import { db, setupPresence } from "./firebase";

const auth = getAuth();

export function subscribeCollection(path, orderByValue, queryInput = []) {
  const [list, setList] = useState([]);
  const [queryField, queryOperator, queryValue] = queryInput;

  useEffect(() => {
    let ref = collection(db, path);

    const constraints = [];

    if (orderByValue) constraints.push(orderBy(orderByValue));
    if (queryField)
      constraints.push(where(queryField, queryOperator, queryValue));

    const q = query(ref, ...constraints);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = [];
      snapshot.docs.forEach((doc) => docs.push({ ...doc.data(), id: doc.id }));
      setList(docs);
    });

    return () => unsubscribe();
  }, [path, orderByValue, queryField, queryOperator, queryValue]);

  return list;
}

/* Keep user logged in between sessions */
export function subscribeUserStateChange() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    return onAuthStateChanged(auth, async function (user) {
      if (user) {
        const signedInUser = {
          name: user.displayName,
          id: user.uid,
          img: user.photoURL,
        };
        setUser(signedInUser);

        const usersRef = collection(db, "users");

        /* Add user to `users/user-id` */
        try {
          await setDoc(
            doc(usersRef, user.uid),
            {
              name: user.displayName,
              img: user.photoURL,
            },
            { merge: true }
          );

          setupPresence(signedInUser);
        } catch (err) {
          console.error(err);
        }
      } else {
        setUser(null);
      }
    });
  }, []);
  return user;
}

const cache = {};
window.cache = cache;
const pendingCache = {};
window.pendingCache = pendingCache;

export function useDocWithCache(collection, docId) {
  const path = `${collection}/${docId}`;

  const [docData, setDocData] = useState(cache[path]);

  useEffect(() => {
    if (docData) return;

    /* Handle case when component is unmounted before res comes back */
    let stillMounted = true;

    const promise = pendingCache[path] || getDoc(doc(db, collection, docId));

    promise
      .then((result) => {
        if (stillMounted) {
          const newDoc = { ...result.data(), id: result.id };
          setDocData(newDoc);
          cache[path] = newDoc;
          if (path in pendingCache) delete pendingCache[path];
        }
      })
      .catch((err) => console.error(err));

    return () => {
      stillMounted = false;
    };
  }, [path]);

  return docData;
}

export function subscribeDoc(collection, docId) {
  const path = `${collection}/${docId}`;

  const [docData, setDocData] = useState(null);

  useEffect(() => {
    const docRef = doc(db, collection, docId);

    return onSnapshot(docRef, (newDoc) => {
      const newValues = { ...newDoc.data(), id: newDoc.id };
      setDocData(newValues);
    });
  }, [path]);

  return docData;
}
