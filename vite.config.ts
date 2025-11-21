import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";

export default defineConfig({
    plugins: [react(), tailwind()],
    server: {
        proxy: {
            "/api/weather": {
                target: "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/weather/, ""),
            },
        },
    },
});
