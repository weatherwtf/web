import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    signInWithEmailAndPassword,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
} from "firebase/auth";
import { auth } from "../firebase/firebase";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const validate = () => {
        if (!email || !password) {
            setError("이메일과 비밀번호를 입력하세요.");
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("유효한 이메일을 입력하세요.");
            return false;
        }
        return true;
    };

    const mapFirebaseError = (err: any) => {
        if (!err || !err.code) return err?.message || "로그인 실패";
        switch (err.code) {
            case "auth/user-not-found":
                return "등록된 사용자가 없습니다.";
            case "auth/wrong-password":
                return "비밀번호가 틀렸습니다.";
            case "auth/invalid-email":
                return "유효한 이메일을 입력하세요.";
            case "auth/user-disabled":
                return "비활성화된 계정입니다.";
            default:
                return err.message || "로그인 실패";
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!validate()) return;
        setLoading(true);

        try {
            // persistence 설정: 기억하기(true)->local, 아니면 session
            await setPersistence(
                auth,
                remember ? browserLocalPersistence : browserSessionPersistence
            );

            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            // 필요하면 idToken을 저장 (백엔드 호출용 등)
            const token = await userCredential.user.getIdToken();
            if (remember) localStorage.setItem("auth_token", token);
            else sessionStorage.setItem("auth_token", token);

            navigate("/");
        } catch (err: any) {
            setError(mapFirebaseError(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">로그인</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="text-red-600">{error}</div>}

                <div>
                    <label className="block text-sm mb-1">이메일</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border p-2 rounded"
                        autoComplete="email"
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">비밀번호</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border p-2 rounded"
                        autoComplete="current-password"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                            className="mr-2"
                        />
                        기억하기
                    </label>
                    <Link to="/register" className="text-sm text-blue-600">
                        회원가입
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-60"
                >
                    {loading ? "로그인 중..." : "로그인"}
                </button>
            </form>
        </div>
    );
};

export default LoginPage;