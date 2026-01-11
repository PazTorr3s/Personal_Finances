import { useState } from "react";
import { useTransactionStore } from "./transaction.store";
import type { TransactionType } from "./transaction.types";
import { v4 as uuidv4 } from "uuid";

interface Props {
  type: TransactionType;
}

export default function TransactionForm({ type }: Props) {
  const addTransaction = useTransactionStore((state) => state.addTransaction);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);

  const categories = type === "income"
    ? ["Salario","Bono","Rentas","Regalo","Ventas","Pensión","Inversión","Otro"]
    : ["Alimentación","Cuentas / Pagos","Vivienda","Transporte","Auto","Ropa","Salud e higiene","Diversión","Vacaciones","Suscripciones","Ahorro","Otros"];

  const handleSubmit = () => {
    if (!category || !amount) return;

    addTransaction({
      id: uuidv4(),
      type,
      category,
      description,
      amount,
      date,
    });

    setCategory("");
    setDescription("");
    setAmount(0);
    setDate(new Date().toISOString().split("T")[0]);
  };

return (
  <div className="form-card">
    <h3>Agregar {type === "income" ? "Ingreso" : "Gasto"}</h3>

    <select value={category} onChange={(e) => setCategory(e.target.value)}>
      <option value="">--Selecciona categoría--</option>
      {categories.map((c) => (
        <option key={c} value={c}>{c}</option>
      ))}
    </select>

    <input
      type="text"
      placeholder="Descripción opcional"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
    />

    <input
      type="number"
      placeholder="Monto"
      value={amount === 0 ? "" : amount}
      onChange={(e) => setAmount(Number(e.target.value))}
    />

    <input
      type="date"
      value={date}
      onChange={(e) => setDate(e.target.value)}
    />

    <button
      className={`btn ${type === "income" ? "income" : "expense"}`}
      onClick={handleSubmit}
    >
      Agregar {type === "income" ? "Ingreso" : "Gasto"}
    </button>
  </div>
);
}
