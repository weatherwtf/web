import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
// import { useAuth } from "../hooks/useAuth";
import Home from "../pages/Home";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                {/* 인증된 유저만 홈 접근 */}
                <Route path="/" element={<Home />} />
                {/* 그 외 경로는 /로 리다이렉트 */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
};

// function PrivateRoute({ children }: { children: JSX.Element }) {
//     const { user, loading } = useAuth();

//     if (loading) return <p>로딩중...</p>;
//     if (!user) return <Navigate to="/login" replace />;

//     return children;
// }

export default Router;
