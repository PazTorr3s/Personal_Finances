import { useState } from "react";
import { useTransactionStore } from "../../features/transactions/transaction.store";
import { useFilterStore } from "../../features/filters/filter.store";
import { filterTransactionsByDate } from "../../features/transactions/transaction.utils";
import IncomeForm from "../../form/IncomeForm";
import ExpenseForm from "../../form/ExpenseForm";
import type { Transaction } from "../../features/transactions/transaction.types";

function formatDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  const d = new Date(year, month - 1, day);

  return d.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}


export default function ListGroup() {
  const {addDemoData,resetTransactions} = useTransactionStore();
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

      {transactions.length === 0 && (
        <button
          className="btn demo"
          onClick={() => {
            if (confirm("¿Cargar datos de prueba para la demo?")) {
              addDemoData();
            }
          }}
        >
          Datos de prueba
        </button>
      )}

      {transactions.length > 0 && (
        <button
          className="btn deletedemo"
          onClick={() => {
            if (confirm("¿Eliminar todos los datos?")) {
              resetTransactions();
            }
          }}
        >
          Limpiar datos
        </button>
      )}
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
                  <strong>
                    {t.category}  –  ${t.amount}
                  </strong>
                    <p>{t.description} </p>
                    <p>{formatDate(t.date)}</p>
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
                  <strong>
                    {t.category}  –  ${t.amount}
                  </strong>
                    <p>{t.description} </p>
                    <p>{formatDate(t.date)}</p>
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
