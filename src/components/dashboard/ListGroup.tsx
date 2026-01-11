import { useState } from "react";
import { useTransactionStore } from "../../features/transactions/transaction.store";
import { useFilterStore } from "../../features/filters/filter.store";
import { filterTransactionsByDate } from "../../features/transactions/transaction.utils";
import IncomeForm from "../../form/IncomeForm";
import ExpenseForm from "../../form/ExpenseForm";
import type { Transaction } from "../../features/transactions/transaction.types";

export default function ListGroup() {
  const [showIncome, setShowIncome] = useState(false);
  const [showExpense, setShowExpense] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Transaction | null>(null);
  const [editingExpense, setEditingExpense] = useState<Transaction | null>(null);
  const transactions = useTransactionStore(state => state.transactions);
  const deleteTransaction = useTransactionStore(state => state.deleteTransaction);
  const { mode, selectedDate } = useFilterStore();
  const filtered = filterTransactionsByDate(
    transactions,
    new Date(selectedDate),
    mode
  );

  const incomes = filtered.filter(t => t.type === "income");
  const expenses = filtered.filter(t => t.type === "expense");

  return (
    <div className="list">
      <section className="actions">
        <button className="btn income" onClick={() => setShowIncome(true)}>Agregar Ingreso</button>
        <button className="btn expense" onClick={() => setShowExpense(true)}>Agregar Gasto</button>
      </section>

      <IncomeForm
        isOpen={showIncome}
        onClose={() => {
          setShowIncome(false);
          setEditingIncome(null);
        }}
        transaction={editingIncome}
      />

      <ExpenseForm
        isOpen={showExpense}
        onClose={() => {
          setShowExpense(false);
          setEditingExpense(null);
        }}
        transaction={editingExpense}
      />

      <section className="list-section">
        <h2>Ingresos</h2>
        {incomes.map(t => (
          <div key={t.id} className="list-group">
            <span>
              {t.category} – {t.description || "-"} – ${t.amount}
            </span>
            <div className="btns">
              <button className="btn income" onClick={() => {setEditingIncome(t); setShowIncome(true);}}>Editar</button>
              <button className="btn expense" onClick={() => deleteTransaction(t.id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </section>

      <section className="list-section">
        <h2>Gastos</h2>
        {expenses.map(t => (
          <div key={t.id} className="list-group">
            <span>
              {t.category} – {t.description || "-"} – ${t.amount}
            </span>
            <div className="btns">
              <button className="btn income" onClick={() => {setEditingExpense(t); setShowExpense(true);}}>Editar</button>
              <button className="btn expense" onClick={() => deleteTransaction(t.id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
