import { useEffect, useState } from "react";
import { useTransactionStore } from "../features/transactions/transaction.store";
import Modal from "../components/dashboard/Modal";
import type { Transaction } from "../features/transactions/transaction.types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  transaction?: Transaction | null;
}

export default function ExpenseForm({ isOpen, onClose, transaction }: Props) {
  const addTransaction = useTransactionStore(state => state.addTransaction);
  const updateTransaction = useTransactionStore(state => state.updateTransaction);
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
      setAmount(transaction.amount ?? 0);
      setDate(transaction.date);
    }
  }, [transaction]);

  const handleSubmit = () => {
    if (!validate()) return;

    const payload: Transaction = {
      id: transaction?.id ?? crypto.randomUUID(),
      type: "expense",
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
    <div className="form-card">
      <h3>{transaction ? "Editar Gasto" : "Agregar Gasto"}</h3>
      <div className="form-field">
        <select value={category} onChange={e => {
            setCategory(e.target.value);
            setErrors(prev => ({ ...prev, category: undefined }));
          }}>

          <option value="">--Selecciona categoría--</option>
          <option>Alimentación</option>
          <option>Cuentas / Pagos</option>
          <option>Vivienda</option>
          <option>Transporte</option>
          <option>Auto</option>
          <option>Ropa</option>
          <option>Salud e higiene</option>
          <option>Diversión</option>
          <option>Vacaciones</option>
          <option>Suscripciones</option>
          <option>Ahorro</option>
          <option>Otros</option>
        </select>
        {errors.category && (
          <span className="form-error">{errors.category}</span>
        )}

        <input type="text" placeholder="Descripción opcional" value={description}
          onChange={e => setDescription(e.target.value)}/>

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
          onChange={e => setDate(e.target.value)}/>

        <button className="btn expense" onClick={handleSubmit}>
          {transaction ? "Guardar cambios" : "Agregar gasto"}
        </button>
      </div>
    </div>
  </Modal>
);

}
