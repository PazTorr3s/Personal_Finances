import {create} from "zustand";
import type { Transaction } from "./transaction.types";

interface TransactionState {
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
  updateTransaction: (tx: Transaction) => void;
  deleteTransaction: (id: string) => void;
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
      const updated = state.transactions.map((t) => (t.id === tx.id ? tx : t));
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
}));

