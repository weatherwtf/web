import { useWeather } from "../hooks/useWeather";

const Home = () => {
    const { data, loading, error } = useWeather({
        date: "20250120",
        nx: 61,
        ny: 126,
    });

    return (
        <div className="p-4">
            {loading && <p>로딩 중...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {data && (
                <div>
                    <p>기온: {data.temperature}°C</p>
                    <p>하늘: {data.sky}</p>
                    <p>강수유형: {data.rainType}</p>
                </div>
            )}
        </div>
    );
};
export default Home;
