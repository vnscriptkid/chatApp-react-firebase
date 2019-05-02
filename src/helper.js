import {useEffect, useState} from 'react';
import {db} from './firebase';

function subscribeCollection(path, orderByValue, query = []) {
    const [ list, setList ] = useState([  ])
    const [prop, operator, value] = query;

    useEffect(() => {
        let ref = db.collection(path);
        ref = orderByValue ? ref.orderBy(orderByValue) : ref;
        ref = prop ? ref.where(prop, operator, value) : ref;
        const unsubscribe = ref
            .onSnapshot((snapshot) => {
                const docs = [];
                snapshot.docs.forEach(doc => docs.push({ ...doc.data(), id: doc.id }));
                setList(docs);
            })
        return function() {
            unsubscribe();
        };
    }, [path, orderByValue, prop, operator, value])
    return list;
}

const cache = {};
window.cache = cache;
const pendingCache = {}
window.pendingCache = pendingCache;
// cache[path]

function subscribeDoc(path) {
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
        db.doc(path).get()            
            .then(result => {
                if (stillMounted) {
                    // console.log('%c useEffect got async data', 'color: red');
                    const newDoc = { ...result.data(), id: result.id };
                    setDoc(newDoc);
                    cache[path] = newDoc;
                }
            })
            .catch(err => console.error(err));

        return () => {
            stillMounted = false;
        }
    }, [path])

    return doc;
}

export {subscribeCollection, subscribeDoc}