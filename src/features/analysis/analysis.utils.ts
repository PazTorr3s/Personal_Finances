import type { Transaction } from "../transactions/transaction.types";

export const getPieInsights = (transactions: Transaction[]) => {
  const map = new Map<string, number>();
  transactions.forEach(t => map.set(t.category, (map.get(t.category) || 0) + t.amount));

  let dominant = "";
  let max = 0;
  map.forEach((value, key) => {
    if (value > max) {
      max = value;
      dominant = key;
    }
  });

  const result = Array.from(map.entries()).map(([category, value]) => ({ category, value }));
  return { result, dominant };
};

export function getBarInsights(data: any[]) {
  if (!data.length) {
    return {
      maxIncome: { day: "-", amount: 0 },
      maxExpense: { day: "-", amount: 0 },
      balanceAvg: 0,
    };
  }

  let maxIncome = { day: "", amount: 0 };
  let maxExpense = { day: "", amount: 0 };
  let totalBalance = 0;

  data.forEach(d => {
    if (d.ingresos > maxIncome.amount) {
      maxIncome = { day: d.name, amount: d.ingresos };
    }
    if (d.gastos > maxExpense.amount) {
      maxExpense = { day: d.name, amount: d.gastos };
    }
    totalBalance += d.ingresos - d.gastos;
  });

  return {
    maxIncome,
    maxExpense,
    balanceAvg: totalBalance / data.length,
  };
}


export function getLineInsights(data: any[]) {
  if (!data.length) {
    return {
      trendIncome: "Sin datos",
      peakExpense: { day: "-", amount: 0 },
    };
  }

  let peakExpense = { day: "", amount: 0 };

  data.forEach(d => {
    if (d.gastos > peakExpense.amount) {
      peakExpense = { day: d.name, amount: d.gastos };
    }
  });

  const trendIncome =
    data[data.length - 1].ingresos >= data[0].ingresos
      ? "En aumento"
      : "En descenso";

  return {
    trendIncome,
    peakExpense,
  };
}

