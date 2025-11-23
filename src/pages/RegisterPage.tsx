import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    createUserWithEmailAndPassword,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
} from "firebase/auth";
import { auth } from "../firebase/firebase";

const RegisterPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const validate = () => {
        if (!email || !password || !confirmPassword) {
            setError("모든 필드를 입력하세요.");
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("유효한 이메일을 입력하세요.");
            return false;
        }
        if (password.length < 6) {
            setError("비밀번호는 최소 6자 이상이어야 합니다.");
            return false;
        }
        if (password !== confirmPassword) {
            setError("비밀번호가 일치하지 않습니다.");
            return false;
        }
        return true;
    };

    const mapFirebaseError = (err: any) => {
        if (!err || !err.code) return err?.message || "회원가입 실패";
        switch (err.code) {
            case "auth/email-already-in-use":
                return "이미 사용 중인 이메일입니다.";
            case "auth/invalid-email":
                return "유효한 이메일을 입력하세요.";
            case "auth/weak-password":
                return "비밀번호가 약합니다. 최소 6자 이상 사용하세요.";
            case "auth/operation-not-allowed":
                return "현재 이메일/비밀번호 가입이 허용되지 않습니다.";
            default:
                return err.message || "회원가입 실패";
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!validate()) return;
        setLoading(true);

        try {
            await setPersistence(
                auth,
                remember ? browserLocalPersistence : browserSessionPersistence
            );

            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

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
            <h1 className="text-2xl font-bold mb-4">회원가입</h1>

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
                        autoComplete="new-password"
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">비밀번호 확인</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full border p-2 rounded"
                        autoComplete="new-password"
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
                    <Link to="/login" className="text-sm text-blue-600">
                        로그인
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-60"
                >
                    {loading ? "가입 중..." : "회원가입"}
                </button>
            </form>
        </div>
    );
};

export default RegisterPage;