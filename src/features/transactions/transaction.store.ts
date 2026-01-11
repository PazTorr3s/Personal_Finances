import { create } from "zustand";
import type { Transaction } from "./transaction.types";

interface TransactionState {
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
  updateTransaction: (tx: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addDemoData: () => void;
  resetTransactions: () => void;
}

const LOCAL_STORAGE_KEY = "transactions";

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]"),

  addTransaction: (tx) => {
    set((state) => {
      const updated = [...state.transactions, tx];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return { transactions: updated };
    });
  },

  updateTransaction: (tx) => {
    set((state) => {
      const updated = state.transactions.map((t) =>
        t.id === tx.id ? tx : t
      );
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return { transactions: updated };
    });
  },

  deleteTransaction: (id) => {
    set((state) => {
      const updated = state.transactions.filter((t) => t.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return { transactions: updated };
    });
  },

  addDemoData: () => {
    const today = new Date();
    const todayString = today.toISOString().split("T")[0];

    const demoData: Transaction[] = [
      {
        id: crypto.randomUUID(),
        type: "income",
        category: "Salario",
        amount: 300000,
        description: "Salario mensual",
        date: todayString,
      },
      {
        id: crypto.randomUUID(),
        type: "expense",
        category: "Comida",
        amount: 150000,
        description: "Supermercado",
        date: todayString,
      },
      {
        id: crypto.randomUUID(),
        type: "expense",
        category: "Transporte",
        amount: 2800,
        description: "Movilización",
        date: todayString,
      },
      {
        id: crypto.randomUUID(),
        type: "expense",
        category: "Ahorro",
        amount: 100000,
        description: "Movilización",
        date: todayString,
      },
      {
        id: crypto.randomUUID(),
        type: "income",
        category: "Bono",
        amount: 60000,
        description: "Bono puntual",
        date: todayString,
      },
    ];

    set((state) => {
      const updated = [...state.transactions, ...demoData];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return { transactions: updated };
    });
  },

  resetTransactions: () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    set({ transactions: [] });
  },
}));
