import { useEffect, useState } from "react";
import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export const useCommentsFirebase = (dateKey: string) => {
    const [comments, setComments] = useState<any[]>([]);

    useEffect(() => {
        const q = query(
            collection(db, "comments"),
            where("dateKey", "==", dateKey)
        );

        const unsub = onSnapshot(q, (snap) => {
            const list: any[] = [];

            snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
            setComments(list);
        });

        return () => unsub();
    }, [dateKey]);

    const addComment = async (text: string) => {
        await addDoc(collection(db, "comments"), {
            text,
            dateKey,
            createdAt: new Date().toISOString(),
        });
    };

    const deleteComment = async (id: string) => {
        await deleteDoc(doc(db, "comments", id));
    };

    return { comments, addComment, deleteComment };
};
