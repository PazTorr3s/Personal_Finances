import { useState, useEffect } from "react";
import { useTransactionStore } from "../features/transactions/transaction.store";
import Modal from "../components/dashboard/Modal";
import type { Transaction } from "../features/transactions/transaction.types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  transaction?: Transaction | null;
}

export default function IncomeForm({ isOpen, onClose, transaction }: Props) {
  const { addTransaction, updateTransaction } = useTransactionStore();

  const isEditing = !!transaction;

  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (transaction) {
      setCategory(transaction.category);
      setDescription(transaction.description ?? "");
      setCategory(transaction.category ?? "");
      setAmount(transaction.amount ?? 0);
      setDate(transaction.date);
    }
  }, [transaction]);

  const handleSubmit = () => {
    if (!validate()) return;

    const payload: Transaction = {
      id: transaction?.id ?? crypto.randomUUID(),
      type: "income",
      category,
      description,
      amount,
      date,
    };

    transaction ? updateTransaction(payload) : addTransaction(payload);
    onClose();
  };


  const [errors, setErrors] = useState<{
    category?: string;
    amount?: string;
  }>({});

  const validate = () => {
  const newErrors: typeof errors = {};
    if (!category) {
      newErrors.category = "Debes seleccionar una categoría";
    }

    if (!amount || amount <= 0) {
      newErrors.amount = "Debes ingresar un monto válido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  


  return (
    <Modal isOpen={isOpen} onClose={onClose}>

      <h3>{isEditing ? "Editar Ingreso" : "Agregar Ingreso"}</h3>
      <div className="form-field">
      <select value={category} onChange={e => {
          setCategory(e.target.value);
          setErrors(prev => ({ ...prev, category: undefined }));
        }}>
        <option value="">--Selecciona categoría--</option>
        <option>Salario</option>
        <option>Bono</option>
        <option>Rentas</option>
        <option>Regalo</option>
        <option>Ventas</option>
        <option>Pensión</option>
        <option>Inversión</option>
        <option>Otro</option>
      </select>
      {errors.category && (
        <span className="form-error">{errors.category}</span>
      )}

      <input placeholder="Descripción (opcional)" value={description}
      onChange={e => setDescription(e.target.value)}
      />

      <input type="number" placeholder="Monto" value={amount === 0 ? "" : amount}
        onChange={e => {
          setAmount(Number(e.target.value));
          setErrors(prev => ({ ...prev, amount: undefined }));
        }}
      />
      {errors.amount && (
        <span className="form-error">{errors.amount}</span>
      )}

      <input type="date" value={date}
        onChange={e => setDate(e.target.value)}
      />

      <button className="btn income" onClick={handleSubmit}>
        {isEditing ? "Guardar cambios" : "Agregar ingreso"}
      </button>

      </div>
    </Modal>
  );
}
