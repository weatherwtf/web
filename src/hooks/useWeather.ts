import { useEffect, useState } from "react";
import axios from "axios";

interface WeatherParams {
    date: string; // 20250101 형태
    time?: string; // 0500 이런 형태 (기상청은 2시간 단위)
    nx: number;
    ny: number;
}

interface WeatherItem {
    category: string;
    fcstValue: string;
    fcstTime: string;
    fcstDate: string;
}

interface WeatherResponse {
    temperature?: string;
    sky?: string;
    rainType?: string;
    raw: WeatherItem[];
}

export function useWeather({ date, time = "0500", nx, ny }: WeatherParams) {
    const [data, setData] = useState<WeatherResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const serviceKey = import.meta.env.BASE_URL;

    useEffect(() => {
        if (!date) return;
        async function fetchWeather() {
            setLoading(true);
            setError(null);
            try {
                const url =
                    `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?` +
                    `serviceKey=${serviceKey}&pageNo=1&numOfRows=1000&dataType=JSON&` +
                    `base_date=${date}&base_time=${time}&nx=${nx}&ny=${ny}`;

                const res = await axios.get(url);

                const items: WeatherItem[] = res.data.response.body.items.item;

                const temperature = items.find(
                    (i) => i.category === "TMP"
                )?.fcstValue;
                const sky = items.find((i) => i.category === "SKY")?.fcstValue;
                const rainType = items.find(
                    (i) => i.category === "PTY"
                )?.fcstValue;

                setData({
                    temperature,
                    sky,
                    rainType,
                    raw: items,
                });
            } catch (err: any) {
                console.error(err);
                setError("날씨 정보를 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        }

        fetchWeather();
    }, [date, time, nx, ny, serviceKey]);

    return { data, loading, error };
}
