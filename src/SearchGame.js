import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { connectWS, findGame } from "./ws/client";

function RoomCard({ roomName, rating, playersConnected, maxPlayers, prizeMoney, isRanked, onJoin }) {
  const connectedPercentage = (playersConnected / maxPlayers) * 100;

  return (
    <div className="flex flex-col justify-between p-4 rounded-xl bg-[#1a1a2e] border border-purple-500 shadow-lg shadow-purple-800/50 w-full max-w-md h-auto min-h-[240px] transition hover:scale-[1.02] hover:shadow-purple-600/70">
      {/* Заголовок и инфо */}
      <div className="space-y-2 text-center">
        <h3 className="font-bold text-xl text-yellow-300 drop-shadow-md">{roomName}</h3>
        <div className="text-sm text-gray-300">
          Средний рейтинг: <span className="font-semibold text-white">{rating}</span>
        </div>
        <div className="text-sm text-gray-300">
          Деньги на игру: <span className="font-semibold text-green-400">${prizeMoney}</span>
        </div>
        <div className={`text-sm font-semibold ${isRanked ? "text-green-400" : "text-pink-400"}`}>
          {isRanked ? "Рейтинговая игра" : "Casual игра"}
        </div>
      </div>

      {/* Игроки + прогресс */}
      <div className="mt-4">
        <div className="text-sm mb-2 text-gray-300 text-center">
          {playersConnected}/{maxPlayers} игроков
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-400 to-green-600 h-full transition-all"
            style={{ width: `${connectedPercentage}%` }}
          />
        </div>

        {/* Кнопка */}
        <button
          onClick={onJoin}
          className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition shadow-md shadow-purple-800/50"
        >
          🚀 Присоединиться
        </button>
      </div>
    </div>
  );
}

function LoadingModal({ isOpen }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-lg font-semibold text-gray-800">Поиск игры...</p>
      </div>
    </div>
  );
}

export default function GameSearch() {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  connectWS(navigate);

  useEffect(() => {
    const generateRooms = () => {
      const newRooms = Array.from({ length: 6 }, (_, index) => ({
        roomName: `Комната ${index + 1}`,
        rating: (Math.random() * 2 + 3).toFixed(1),
        playersConnected: Math.floor(Math.random() * 4),
        maxPlayers: 4,
        prizeMoney: Math.floor(Math.random() * 200 + 50),
        isRanked: Math.random() > 0.5,
      }));
      setRooms(newRooms);
    };

    generateRooms();
    const interval = setInterval(generateRooms, 5000);
    return () => clearInterval(interval);
  }, []);

  const startSearchGame = () => {
    findGame();
    setIsLoading(true);
  };

  return (
    <div className="min-h-screen login-bg text-gray-900 p-2 flex flex-col gap-6">
      {/* Заголовок */}

      <div className="mb-6 flex items-center justify-between w-full px-4">
        {/* Логотип / Название */}
        <div className="relative inline-block px-8 py-3 border-4 border-purple-500 rounded-lg bg-[#1a1a2e] shadow-lg shadow-purple-600/50">
          <span className="text-4xl font-extrabold text-pink-400 tracking-widest uppercase drop-shadow-[0_0_8px_#f472b6]">
            Белка
          </span>
          {/* Украшения по углам */}
          <div className="absolute top-0 left-0 w-3 h-3 bg-pink-400 rounded-full -mt-1 -ml-1 shadow-[0_0_6px_#f472b6]" />
          <div className="absolute top-0 right-0 w-3 h-3 bg-pink-400 rounded-full -mt-1 -mr-1 shadow-[0_0_6px_#f472b6]" />
          <div className="absolute bottom-0 left-0 w-3 h-3 bg-pink-400 rounded-full -mb-1 -ml-1 shadow-[0_0_6px_#f472b6]" />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-pink-400 rounded-full -mb-1 -mr-1 shadow-[0_0_6px_#f472b6]" />
        </div>

        {/* Пользовательский блок */}
        <div className="flex flex-col items-center space-y-1">
          {/* Аватар */}
          <img
            src="https://api.dicebear.com/7.x/thumbs/svg?seed=belka"
            alt="avatar"
            className="w-10 h-10 rounded-full border-2 border-purple-500 shadow-[0_0_8px_#a855f7]"
          />

          {/* Ник */}
          <span className="text-pink-400 font-bold drop-shadow-[0_0_6px_#f472b6] truncate max-w-[120px] text-sm">
            @squirrelKing
          </span>

          {/* Рейтинг */}
          <div className="flex items-center space-x-1 text-yellow-300 font-semibold drop-shadow-[0_0_6px_#fde047] text-sm">
            <svg xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 fill-yellow-300 drop-shadow-[0_0_6px_#fde047]"
                viewBox="0 0 24 24">
              <path d="M12 .587l3.668 7.568L24 9.423l-6 5.84L19.336 24 12 19.897 4.664 24 6 15.263 0 9.423l8.332-1.268z"/>
            </svg>
            <span>1520</span>
          </div>
        </div>
      </div>

      {/* Кнопки */}
      <div className="flex flex-wrap justify-center gap-3">
        {/* Главная кнопка — поиск игры (жёлтый акцент) */}
        <button
          onClick={startSearchGame}
          className="px-4 py-2 bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-500 shadow-md shadow-yellow-600/50"
        >
          Поиск игры
        </button>

        {/* Второстепенные кнопки — фиолетовая палитра */}
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 shadow-md shadow-purple-800/50">
          Друзья
        </button>

        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 shadow-md shadow-purple-800/50">
          Колоды
        </button>

        {/* Акцент — рейтинг (красный, но более мягкий) */}
        <button className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 shadow-md shadow-red-700/50">
          Рейтинг
        </button>
      </div>
      {/* Список комнат */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {rooms.map((room, i) => (
          <RoomCard key={i} {...room} onJoin={startSearchGame} />
        ))}
      </div>

      {/* Модалка загрузки */}
      <LoadingModal isOpen={isLoading} />
    </div>
  );
}
