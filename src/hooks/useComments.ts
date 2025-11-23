import { useEffect, useState } from "react";

export interface CommentItem {
    id: number;
    text: string;
    date: string;
}

export const useComments = (dateKey: string) => {
    const storageKey = `comments-${dateKey}`;
    const [comments, setComments] = useState<CommentItem[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            setComments(JSON.parse(saved));
        } else {
            setComments([]); // 날짜 바뀌면 다른 댓글 목록
        }
    }, [storageKey]);

    const addComment = (text: string) => {
        const newComment = {
            id: Date.now(),
            text,
            date: new Date().toISOString(),
        };

        const updated = [...comments, newComment];
        setComments(updated);
        localStorage.setItem(storageKey, JSON.stringify(updated));
    };

    const deleteComment = (id: number) => {
        const updated = comments.filter((c) => c.id !== id);
        setComments(updated);
        localStorage.setItem(storageKey, JSON.stringify(updated));
    };

    return {
        comments,
        addComment,
        deleteComment,
    };
};
