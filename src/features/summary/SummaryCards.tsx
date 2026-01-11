import { useMemo } from "react";
import { useTransactionStore } from "../transactions/transaction.store";
import { useFilterStore } from "../filters/filter.store";
import { filterTransactionsByDate } from "../transactions/transaction.utils";

export default function SummaryCards() {
  const transactions = useTransactionStore((state) => state.transactions);
  const { mode, selectedDate } = useFilterStore();
  const filtered = useMemo(
    () => filterTransactionsByDate(transactions, selectedDate, mode),
    [transactions, selectedDate, mode]
  );

  const { income, expense } = useMemo(() => {
    let inc = 0;
    let exp = 0;

    filtered.forEach((t) => {
      if (t.type === "income") inc += t.amount;
      else exp += t.amount;
    });

    return { income: inc, expense: exp };
  }, [filtered]);

  const balance = income - expense;

  return (
    <div className="summary">
      <div className="card">
        <h3>Ingresos</h3>
        <p className="amount">${income.toLocaleString()}</p>
        <span>Total ingresos</span>
      </div>

      <div className="card">
        <h3>Gastos</h3>
        <p className="amount">${expense.toLocaleString()}</p>
        <span>Total gastos</span>
      </div>

      <div className="card" style={{borderLeft: `6px solid ${balance >= 0 ? "green" : "red"}`}}>
        <h3>Balance</h3>
        <p className="amount">${balance.toLocaleString()}</p>
        <span>Ingresos − Gastos</span>
      </div>
    </div>
  );
}
