import React, { useState } from "react";
import { useWeather } from "../hooks/useWeather";

export default function HomePage() {
    const [selectedDate, setSelectedDate] = useState("20251121");
    const [nx] = useState(61);
    const [ny] = useState(126);

    const { weather, loading, error } = useWeather(selectedDate, nx, ny);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = e.target.value.replaceAll("-", "");
        setSelectedDate(date);
    };

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-4">홈</h1>

            <div className="mb-4">
                <label className="mr-2">날짜 선택:</label>
                <input
                    type="date"
                    value={`${selectedDate.slice(0, 4)}-${selectedDate.slice(
                        4,
                        6
                    )}-${selectedDate.slice(6, 8)}`}
                    onChange={handleDateChange}
                    className="border p-1 rounded"
                />
            </div>

            {loading && <div>로딩중...</div>}
            {error && <div className="text-red-600">{error}</div>}

            {!loading && !error && weather.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold mb-2">날씨 정보</h2>
                    <ul>
                        {weather.map((item, idx) => (
                            <li key={idx}>
                                {item.fcstDate} {item.fcstTime} -{" "}
                                {item.category}: {item.fcstValue}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
