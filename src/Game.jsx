import { motion } from "framer-motion";
import { useGameStore } from "./store";
import { playCard as sendPlayCard } from "./ws/client";

const SUIT_SYMBOLS = {
  SPADES: "♠️",
  HEARTS: "♥️",
  DIAMONDS: "♦️",
  CLUBS: "♣️",
};

const RANK_MAP = {
  SEVEN: "7",
  EIGHT: "8",
  NINE: "9",
  TEN: "10",
  JACK: "J",
  QUEEN: "Q",
  KING: "K",
  ACE: "A",
};

const normalizeRank = (rank) => {
  const map = {
    Seven: "7", Eight: "8", Nine: "9", Ten: "10",
    Jack: "j", Queen: "q", King: "k", Ace: "a",
  };
  return map[rank] || rank?.toLowerCase();
};

const normalizeSuit = (suit) => {
  const map = {
    Hearts: "h", Diamonds: "d", Clubs: "c", Spades: "s",
    "♥️": "h", "♦️": "d", "♣️": "c", "♠️": "s",
  };
  return map[suit] || suit?.toLowerCase();
};

const PlayerLabel = ({ name, isCurrent }) => (
  <div className="text-xs sm:text-sm text-center">
    <div className={isCurrent ? "text-green-500 font-semibold" : "text-gray-300"}>{name}</div>
    {isCurrent && <div className="text-red-400 animate-pulse text-[10px]">Ваш ход</div>}
  </div>
);

const Card = ({ card }) => {
  const rank = RANK_MAP[card.rank?.toUpperCase()] || card.rank;
  const suit = SUIT_SYMBOLS[card.suit?.toUpperCase()] || card.suit;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-12 h-16 sm:w-14 sm:h-20 border rounded-md bg-yellow-50 flex items-center justify-center text-lg shadow font-bold"
    >
      <span>{rank}{suit}</span>
    </motion.div>
  );
};

export default function GameTable() {
  const hand = useGameStore((s) => s.hand);
  const yourTurn = useGameStore((s) => s.yourTurn);
  const position = useGameStore((s) => s.position);
  const gameOver = useGameStore((s) => s.gameOver);
  const cardsOnTable = useGameStore((s) => s.cardsOnTable || []);
  const scores = useGameStore((s) => s.scores);
  const trump = useGameStore((s) => s.trump);

  const playCard = (card) => {
    // if (!yourTurn) return;
    // useGameStore.getState().setYourTurn(false);
    const sendCard = {
      rank: normalizeRank(card.rank),
      suit: normalizeSuit(card.suit),
    };
    sendPlayCard(sendCard);
  };

  const renderTrump = () => {
    const map = {
      Hearts: "♥", Diamonds: "♦", Clubs: "♣️", Spades: "♠",
    };

    return (
      <div className="absolute left-2 top-2 text-white text-sm sm:text-base bg-black/20 px-2 py-1 rounded">
        Козырь: {map[trump]}
      </div>
    );
  };

  const renderEye = () => {
    return (
      <div className="absolute left-2 top-10 text-white text-sm sm:text-base bg-black/20 px-2 py-1 rounded">
        Глаза: ♣️
      </div>
    );
  };


  return (
    <div className="min-h-screen login-bg flex flex-col items-center justify-center space-y-4 py-4 bg-gradient-to-b from-[#0f0f1e] to-[#1a1a2e]">
      {/* Заголовок */}
      <div className="mb-2 text-center w-full">
        <div className="relative inline-block px-6 py-3 border-4 border-pink-500 rounded-lg bg-[#1a1a2e] shadow-[0_0_20px_#f472b6]">
          <span className="text-3xl font-extrabold text-pink-400 tracking-widest uppercase drop-shadow-[0_0_8px_#f472b6]">
            Белка
          </span>
        </div>
      </div>

      {/* Игровое поле */}
      <div className="relative w-full max-w-[500px] aspect-[3/4] sm:max-w-[600px] rounded-xl border-4 border-purple-700 bg-[#15152b] shadow-[0_0_25px_#7c3aed] p-3 sm:p-5 flex flex-col justify-between">

        {/* Трамп или глаз */}
        {renderTrump()}

        {/* Верхний игрок */}
        <div className="flex justify-center items-center h-12">
          <PlayerLabel name="Игрок 1" isCurrent={position === 0 && yourTurn} />
        </div>

        {/* Средняя зона (левый и правый игроки + карты) */}
        <div className="flex-1 flex justify-between items-center px-3 sm:px-6">
          <div className="w-14 text-center">
            <PlayerLabel name="Игрок 2" isCurrent={position === 1 && yourTurn} />
          </div>

          <div className="relative w-40 h-40 sm:w-52 sm:h-52">
            {cardsOnTable[0] && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 drop-shadow-[0_0_10px_#facc15]">
                <Card card={cardsOnTable[0]} />
              </div>
            )}
            {cardsOnTable[1] && (
              <div className="absolute top-1/2 left-0 -translate-y-1/2 drop-shadow-[0_0_10px_#22c55e]">
                <Card card={cardsOnTable[1]} />
              </div>
            )}
            {cardsOnTable[2] && (
              <div className="absolute top-1/2 right-0 -translate-y-1/2 drop-shadow-[0_0_10px_#3b82f6]">
                <Card card={cardsOnTable[2]} />
              </div>
            )}
            {cardsOnTable[3] && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 drop-shadow-[0_0_10px_#ec4899]">
                <Card card={cardsOnTable[3]} />
              </div>
            )}
          </div>

          <div className="w-14 text-center">
            <PlayerLabel name="Игрок 3" isCurrent={position === 2 && yourTurn} />
          </div>
        </div>

        {/* Нижний игрок (Вы) */}
        <div className="flex flex-col items-center space-y-3">
          <PlayerLabel name="Вы" isCurrent={yourTurn} />
          <div className="flex flex-wrap justify-center gap-3 px-2">
            {hand.map((card, idx) => (
              <button
                key={idx}
                onClick={() => playCard(card)}
                disabled={!yourTurn}
                className="hover:-translate-y-2 transition-transform drop-shadow-[0_0_12px_#a855f7]"
              >
                <Card card={card} />
              </button>
            ))}
          </div>
        </div>

        {/* Game Over */}
        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-xl">
            <div className="text-center text-pink-400 drop-shadow-[0_0_10px_#f472b6]">
              <h2 className="text-3xl font-extrabold mb-2">Игра окончена</h2>
              <p className="text-xl">
                Счёт: A {scores.team_a} — B {scores.team_b}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
