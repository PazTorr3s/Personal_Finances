import { useTransactionStore } from "./transaction.store";
import { useFilterStore } from "../filters/filter.store";
import { filterTransactionsByDate } from "./transaction.utils";

export default function TransactionList() {
  const transactions = useTransactionStore(state => state.transactions);
  const deleteTransaction = useTransactionStore(state => state.deleteTransaction);
  const { mode, selectedDate } = useFilterStore();
  const filteredTransactions = filterTransactionsByDate(
    transactions,
    selectedDate,
    mode
  );

  const expenses = filteredTransactions.filter(t => t.type === "expense");
  const incomes = filteredTransactions.filter(t => t.type === "income");

  return (
    <div className="transaction-lists">
      <section className="list-section">
        <h2>Gastos</h2>
        {expenses.length === 0 ? (<p>No hay gastos</p>) : (expenses.map(t => (
            <div key={t.id} className="list-group">
              <div>
                <strong>{t.category}</strong> – {t.description || "-"}
                <br />
                <small className="transaction-date">
                  {new Date(t.date).toLocaleDateString("es-CL", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  })}
                </small>
              </div>

              <div className="list-right">
                <span className="amount expense">
                  ${t.amount.toLocaleString()}
                </span>
                <button className="btn expense" onClick={() => deleteTransaction(t.id)}>Eliminar</button>
              </div>
            </div>
          ))
        )}
      </section>

      <section className="list-section">
        <h2>Ingresos</h2>
        {incomes.length === 0 ? (<p>No hay ingresos</p>) : (incomes.map(t => (
            <div key={t.id} className="list-group">
              <div>
                <strong>{t.category}</strong> – {t.description || "-"}
                <br />
                <small className="transaction-date">
                  {new Date(t.date).toLocaleDateString("es-CL", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  })}
                </small>
              </div>

              <div className="list-right">
                <span className="amount income">
                  ${t.amount.toLocaleString()}
                </span>
                <button className="btn income" onClick={() => deleteTransaction(t.id)}>Eliminar</button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
