import { useState, useEffect } from "react";
import axios from "axios";

export const useWeather = (date: string, nx: number, ny: number) => {
    const [weather, setWeather] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWeather = async () => {
            setLoading(true);
            try {
                const res = await axios.get("/api/weather/getVilageFcst", {
                    params: {
                        serviceKey: encodeURIComponent(
                            import.meta.env.VITE_WEATHER_API_KEY
                        ),
                        pageNo: 1,
                        numOfRows: 1000,
                        dataType: "JSON",
                        base_date: date,
                        base_time: "0500",
                        nx,
                        ny,
                    },
                });

                if (res.data.response?.body?.items?.item) {
                    setWeather(res.data.response.body.items.item);
                } else {
                    setWeather([]);
                }
            } catch (err: any) {
                console.error(err);
                setError("날씨 정보를 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, [date, nx, ny]);

    return { weather, loading, error };
};
