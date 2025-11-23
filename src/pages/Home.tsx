import { useState, type JSX } from "react";
import { useWeather } from "../hooks/useWeather";
import { useComments } from "../hooks/useComments";
import { Cloud, Sun, CloudRain, Snowflake, Wind } from "lucide-react";

const HomePage = () => {
    const today = new Date().toISOString().slice(0, 10);
    const [selectedDate, setSelectedDate] = useState(today);

    const yyyymmdd = selectedDate.replaceAll("-", "");
    const { weather, loading, error } = useWeather(yyyymmdd, 61, 126);

    const { comments, addComment, deleteComment } = useComments(yyyymmdd);
    const [newComment, setNewComment] = useState("");

    const weatherIconMap: Record<string, JSX.Element> = {
        PTY: <CloudRain className="w-6 h-6 text-gray-400" />,
        SKY: <Cloud className="w-6 h-6 text-gray-400" />,
        TMP: <Sun className="w-6 h-6 text-gray-400" />,
        WSD: <Wind className="w-6 h-6 text-gray-400" />,
        SNO: <Snowflake className="w-6 h-6 text-gray-400" />,
    };

    return (
        <div className="w-full min-h-screen bg-neutral-900 text-gray-200 p-6">
            <div className="max-w-3xl mx-auto">
                {/* 날짜 선택 */}
                <div className="mb-6">
                    <input
                        type="date"
                        value={selectedDate}
                        className="bg-neutral-800 border border-neutral-700 px-3 py-2 rounded text-gray-200"
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>

                {/* 날씨 */}
                <div className="bg-neutral-800 border border-neutral-700 p-4 rounded-lg mb-8">
                    <h2 className="text-lg font-semibold mb-3">날씨 정보</h2>

                    {loading && <p>로딩중...</p>}
                    {error && <p className="text-red-400">{error}</p>}

                    {!loading && !error && weather.length > 0 && (
                        <div className="flex overflow-x-auto gap-4 pb-2">
                            {weather.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="min-w-[150px] bg-neutral-700 rounded-lg p-4 flex flex-col items-center"
                                >
                                    <div className="mb-2">
                                        {weatherIconMap[item.category] || (
                                            <Cloud className="w-6 h-6 text-gray-500" />
                                        )}
                                    </div>
                                    <p className="text-sm">{item.fcstTime}</p>
                                    <p className="text-xl font-bold">
                                        {item.fcstValue}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {item.category}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 댓글 */}
                <div className="bg-neutral-800 border border-neutral-700 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-3">댓글</h2>

                    <div className="flex gap-2 mb-3">
                        <input
                            type="text"
                            value={newComment}
                            placeholder="댓글 입력..."
                            onChange={(e) => setNewComment(e.target.value)}
                            className="flex-1 bg-neutral-700 px-3 py-2 rounded text-gray-200 border border-neutral-600"
                        />
                        <button
                            onClick={() => {
                                if (newComment.trim()) {
                                    addComment(newComment.trim());
                                    setNewComment("");
                                }
                            }}
                            className="bg-neutral-600 px-4 py-2 rounded"
                        >
                            등록
                        </button>
                    </div>

                    <div className="flex flex-col gap-3">
                        {comments.map((c) => (
                            <div
                                key={c.id}
                                className="bg-neutral-700 border border-neutral-600 p-3 rounded flex justify-between"
                            >
                                <div>
                                    <p>{c.text}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {new Date(c.date).toLocaleString()}
                                    </p>
                                </div>
                                <button
                                    className="text-red-400 text-sm"
                                    onClick={() => deleteComment(c.id)}
                                >
                                    삭제
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
