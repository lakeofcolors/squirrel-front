import { useGameStore } from "../store";
import { toast } from 'react-toastify';

let socket = null;
let pingInterval;

export function connectWS(navigate) {
  if (getSocket()) {
    return;
  }
  let token = getToken();
  console.log(token);
  socket = new WebSocket("ws://localhost:9221/api/ws");

  socket.onopen = () => {
    const store = useGameStore.getState();
    socket.send(JSON.stringify({ op: "auth", token: token }));

    pingInterval = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(new Uint8Array([9]));
      }
    }, 1000);

    // socket.send(JSON.stringify({ op: "findgame" }));
  };

  socket.onclose = () => {
    setTimeout(() => reconnect(), 3000); // авто-реконнект
  };

  socket.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    const store = useGameStore.getState();

    switch (msg.event) {
      case "game_start":
        store.setPosition(msg.position); // если хочешь сохранить позицию
        navigate("/game");
        break;
      case "game_close":
        toast("Game over(Player disconnect)")
        setTimeout(() => {
          navigate("/find");
        }, 4000); // 2 секунды задержки
        break;
      case "your_hand":
        store.setHand(msg.cards);
        break;
      case "your_turn":
        store.setYourTurn(true);
        break;
      case "trump_updated":
        store.setTrump(msg.trump);
        break;
      case "card_played":
        const { card, position } = msg;
        const state = useGameStore.getState();

        // Добавляем карту на стол
        const updatedTable = [...(state.cardsOnTable || []), card];
        state.setCardsOnTable(updatedTable);

        // Если ты сыграл эту карту — убери её из руки
        if (position === state.position) {
          const updatedHand = state.hand.filter(
            (c) => !(c.rank === card.rank && c.suit === card.suit)
          );
          state.setHand(updatedHand);
        }
        break;
      case "trick_won":
        // Победитель взятки
        store.setCardsOnTable([])
        break;
      case "eye_updated":
        store.setEyes({ team_a: msg.team_a, team_b: msg.team_b });
        break;
      case "game_over":
        store.setGameOver(true);
        store.setScores(msg.scores);
        toast("Game over")
        setTimeout(() => {
          navigate("/find");
        }, 4000); // 2 секунды задержки

        break;
      case "error":
        toast(msg.detail)
        useGameStore.getState().setLastError(msg.detail);
        useGameStore.getState().setYourTurn(true);
        break
      default:
        break;
    }
  };
}

export function getSocket() {
  return socket;
}

function reconnect() {
  const socket = new WebSocket("ws://localhost:9221/api/ws");
  socket.onopen = () => {
    socket.send(JSON.stringify({ op: "auth", token: getToken() }));
  };
}

function getToken() {
  return localStorage.getItem("access_token");
}

export function findGame() {
  const socket = getSocket();
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ op: "findgame" }));
  }
}

export function playCard(card) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ op: "playcard", rank: card.rank, suit: card.suit }));
    useGameStore.getState().setYourTurn(false);
  }
}
