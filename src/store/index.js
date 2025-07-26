import { create } from 'zustand';

export const useGameStore = create((set) => ({
  access_token: null,
  setToken: (access_token) => set({ access_token }),

  hand: [],
  position: null,
  yourTurn: false,
  scores: { team_a: 0, team_b: 0 },
  eyes: { team_a: 0, team_b: 0 },
  gameOver: false,
  cardsOnTable: [],
  trump: "Clubs",

  lastError: null,
  setLastError: (msg) => set({ lastError: msg }),

  setTrump: (trump) => set({ trump: trump }),

  setHand: (cards) => set({ hand: cards }),
  setPosition: (position) => set({ position }),
  setYourTurn: (turn) => set({ yourTurn: turn }),
  setScores: (scores) => set({ scores }),
  setEyes: (eyes) => set({ eyes }),
  setGameOver: (val) => set({ gameOver: val }),
  setCardsOnTable: (cards) => set({ cardsOnTable: cards }),

  playCard: (card) => {
    set((state) => ({
      cardsOnTable: [...state.cardsOnTable, card],
      hand: state.hand.filter(
        (c) => !(c.rank === card.rank && c.suit === card.suit)
      ),
    }));
  },
}));
