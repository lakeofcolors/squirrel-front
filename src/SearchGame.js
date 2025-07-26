import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { connectWS, findGame } from "./ws/client";

function RoomCard({ roomName, rating, playersConnected, maxPlayers, prizeMoney, isRanked, onJoin }) {
  const connectedPercentage = (playersConnected / maxPlayers) * 100;

  return (
    <div className="flex flex-col justify-between p-4 border border-gray-300 rounded-xl bg-white shadow w-full max-w-md h-auto min-h-[240px]">
      <div className="space-y-1">
        <h3 className="font-semibold text-lg text-center text-gray-800">{roomName}</h3>
        <div className="text-sm text-gray-600">Средний рейтинг: <span className="font-medium text-gray-800">{rating}</span></div>
        <div className="text-sm text-gray-600">Деньги на игру: <span className="font-medium text-gray-800">${prizeMoney}</span></div>
        <div className={`text-sm font-medium ${isRanked ? "text-green-600" : "text-red-500"}`}>
          {isRanked ? "Рейтинговая игра" : "Не рейтинговая игра"}
        </div>
      </div>

      <div className="mt-3">
        <div className="text-sm mb-1 text-center text-gray-700">{playersConnected}/{maxPlayers} игроков</div>
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div className="bg-green-500 h-full" style={{ width: `${connectedPercentage}%` }} />
        </div>
        <button
          onClick={onJoin}
          className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          Присоединиться
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
    <div className="min-h-screen bg-gray-100 text-gray-900 p-4 flex flex-col gap-6">
      {/* Заголовок */}
      {/* <div className="w-full text-center"> */}
      {/*   <div className="inline-block px-6 py-3 border-4 border-yellow-500 rounded-lg bg-yellow-100 shadow font-bold text-2xl sm:text-3xl uppercase"> */}
      {/*     Белка */}
      {/*   </div> */}
      {/* </div> */}

      <div className="mb-4 text-center w-full">
        <div className="relative inline-block px-4 py-2 border-4 border-yellow-600 rounded-lg bg-yellow-100 shadow-md w-full max-w-xs">
          <span className="text-3xl font-bold text-black tracking-wide uppercase">Белка</span>
          <div className="absolute top-0 left-0 w-2 h-2 bg-black rounded-full -mt-1 -ml-1"></div>
          <div className="absolute top-0 right-0 w-2 h-2 bg-black rounded-full -mt-1 -mr-1"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 bg-black rounded-full -mb-1 -ml-1"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-black rounded-full -mb-1 -mr-1"></div>
        </div>
      </div>


      {/* Кнопки */}
      <div className="flex flex-wrap justify-center gap-3">
        <button onClick={startSearchGame} className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600">
          Поиск игры
        </button>
        <button className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600">Друзья</button>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600">Пополнить орехи</button>
        <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600">Пополнить тонны</button>
        <button className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600">Рейтинг</button>
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
