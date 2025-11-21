import axios from "axios";

export const fetchWeather = async (date: string, nx: number, ny: number) => {
    const response = await axios.get("/api/weather/getVilageFcst", {
        params: {
            serviceKey: import.meta.env.VITE_WEATHER_API_KEY,
            pageNo: 1,
            numOfRows: 1000,
            dataType: "JSON",
            base_date: date,
            base_time: "0500",
            nx,
            ny,
        },
    });
    return response.data.response.body.items.item;
};
