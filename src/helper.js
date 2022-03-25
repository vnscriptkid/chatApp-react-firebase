import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { collection, doc, onSnapshot, setDoc } from "@firebase/firestore";
import { useEffect, useState } from "react";
import { db, setupPresence } from "./firebase";

const auth = getAuth();

export function subscribeCollection(path, orderByValue, query = []) {
  const [list, setList] = useState([]);
  const [prop, operator, value] = query;

  useEffect(() => {
    let ref = collection(db, path);
    ref = orderByValue ? ref.orderBy(orderByValue) : ref;
    ref = prop ? ref.where(prop, operator, value) : ref;

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const docs = [];
      snapshot.docs.forEach((doc) => docs.push({ ...doc.data(), id: doc.id }));
      setList(docs);
    });

    return () => unsubscribe();
  }, [path, orderByValue, prop, operator, value]);

  return list;
}

export function subscribeUserStateChange() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    return onAuthStateChanged(auth, async function (user) {
      if (user) {
        // User is signed in.
        const signedInUser = {
          name: user.displayName,
          id: user.uid,
          img: user.photoURL,
        };
        setUser(signedInUser);
        // add logged user to db
        const usersRef = collection(db, "users");

        try {
          await setDoc(
            doc(usersRef, user.uid),
            {
              name: user.displayName,
              img: user.photoURL,
            },
            { merge: true }
          );

          console.log("setupPresence for user: ", signedInUser);
          setupPresence(signedInUser);
        } catch (err) {
          console.error(err);
        }

        // collection(db, "users")
        //   .doc(user.uid)
        //   .set(
        //     {
        //       name: user.displayName,
        //       img: user.photoURL,
        //     },
        //     { merge: true }
        //   )
        //   // .then(() => console.log('Update logged user to db'))
        //   .then(
        //     () =>
        //       console.log("setupPresence for user: ", signedInUser) ||
        //       setupPresence(signedInUser)
        //   )
        //   .catch((err) => console.error(err));
      } else {
        // No user is signed in.
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
// cache[path]

export function subscribeDoc(path) {
  // console.log('subscribeDoc', path);
  const [doc, setDoc] = useState(cache[path]);

  useEffect(() => {
    if (doc) {
      // console.log('%c user exists, no need to make more request', 'color: orange');
      return;
    }
    let stillMounted = true;

    // const pending = pendingCache[path];

    // const promise = pending || (pendingCache[path] = db.doc(path).get());

    // console.log('%c useEffect', 'color: white; background: black', path);
    // promise
    db.doc(path)
      .get()
      .then((result) => {
        if (stillMounted) {
          // console.log('%c useEffect got async data', 'color: red');
          const newDoc = { ...result.data(), id: result.id };
          setDoc(newDoc);
          cache[path] = newDoc;
        }
      })
      .catch((err) => console.error(err));

    return () => {
      stillMounted = false;
    };
  }, [path]);

  return doc;
}
