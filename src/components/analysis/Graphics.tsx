import { useTransactionStore } from "../../features/transactions/transaction.store";
import { useFilterStore } from "../../features/filters/filter.store";
import { filterTransactionsByDate } from "../../features/transactions/transaction.utils";
import { useMemo } from "react";
import { parseLocalDate } from "../../features/transactions/transaction.utils";


import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  getPieInsights,
  getBarInsights,
  getLineInsights
} from "../../features/analysis/analysis.utils";

const COLORS = ["#5CE7A2", "#E7615C", "#B25CE7", "#fdcb6e", "#7F71EA"];


export default function AnalysisGraphics() {

  const transactions = useTransactionStore((state) => state.transactions);
  const { mode, selectedDate } = useFilterStore();
  const filtered = useMemo(
    () => filterTransactionsByDate(transactions, selectedDate, mode),
    [transactions, selectedDate, mode]
  );
  const incomes = filtered.filter((t) => t.type === "income");
  const expenses = filtered.filter((t) => t.type === "expense");
  const { result: incomeByCategory, dominant: incomeDominant } =
    getPieInsights(incomes);
  const { result: expenseByCategory, dominant: expenseDominant } =
    getPieInsights(expenses);



const timeSeriesData = useMemo(() => {
  const data: { name: string; ingresos: number; gastos: number }[] = [];
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

if (mode === "day" || mode === "week") {
  const base = new Date(selectedDate);
  base.setHours(0, 0, 0, 0);

  const start =
    mode === "day"
      ? new Date(base)
      : new Date(base.setDate(base.getDate() - ((base.getDay() || 7) - 1)));

  const end =
    mode === "day"
      ? new Date(start)
      : new Date(new Date(start).setDate(start.getDate() + 6));

  const d = new Date(start);

  while (d <= end) {
    let income = 0;
    let expense = 0;

    incomes.forEach((t) => {
if (sameDay(parseLocalDate(t.date), d)) income += t.amount;

    });

    expenses.forEach((t) => {
if (sameDay(parseLocalDate(t.date), d)) expense += t.amount;

    });

    data.push({
      name: d.toLocaleDateString("es-CL", {
        weekday: mode === "week" ? "short" : undefined,
        day: "2-digit",
        month: "2-digit",
      }),
      ingresos: income,
      gastos: expense,
    });

    d.setDate(d.getDate() + 1);
  }
}

  if (mode === "month") {
    const daysInMonth = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1,
      0
    ).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      let income = 0;
      let expense = 0;

      incomes.forEach((t) => {
        const d = new Date(t.date);
        if (
          d.getDate() === day &&
          d.getMonth() === selectedDate.getMonth()
        ) {
          income += t.amount;
        }
      });

      expenses.forEach((t) => {
        const d = new Date(t.date);
        if (
          d.getDate() === day &&
          d.getMonth() === selectedDate.getMonth()
        ) {
          expense += t.amount;
        }
      });

      data.push({
        name: day.toString(),
        ingresos: income,
        gastos: expense,
      });
    }
  }

  if (mode === "year") {
    for (let m = 0; m < 12; m++) {
      let income = 0;
      let expense = 0;

      incomes.forEach((t) => {
        if (new Date(t.date).getMonth() === m) income += t.amount;
      });

      expenses.forEach((t) => {
        if (new Date(t.date).getMonth() === m) expense += t.amount;
      });

      data.push({
        name: new Date(selectedDate.getFullYear(), m, 1).toLocaleString(
          "es-CL",
          { month: "short" }
        ),
        ingresos: income,
        gastos: expense,
      });
    }
  }

  return data;
}, [incomes, expenses, mode,  selectedDate]);

  const barInsights = useMemo(
    () => getBarInsights(timeSeriesData),
    [timeSeriesData]
  );

  const lineInsights = useMemo(
    () => getLineInsights(timeSeriesData),
    [timeSeriesData]
  );

  return (
    <div className="analysis-graphics">
      <section className="analysis-pies">
        <div className="analysis-card pie-card">
          <h3>Distribución de Ingresos</h3>
          <PieChart width={300} height={300}>
            <Pie data={incomeByCategory} dataKey="value" nameKey="category" outerRadius={80} label>
              {incomeByCategory.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
          <p><strong>Principal fuente:</strong> {incomeDominant}</p>
        </div>

        <div className="analysis-card pie-card">
          <h3>Distribución de Gastos</h3>
          <PieChart width={300} height={300}>
            <Pie data={expenseByCategory} dataKey="value" nameKey="category" outerRadius={80} label>
              {expenseByCategory.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
          <p><strong>Categoría dominante:</strong> {expenseDominant}</p>
        </div>
      </section>

      <section className="analysis-card">
        <h3>Ingresos vs Gastos</h3>

        <BarChart width={700} height={300} data={timeSeriesData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="ingresos" fill="#00b894" />
          <Bar dataKey="gastos" fill="#d63031" />
        </BarChart>

        <div className="insights">
          <p>
            Mayor ingreso: {barInsights.maxIncome.day} (
            ${barInsights.maxIncome.amount})
          </p>
          <p>
            Mayor gasto: {barInsights.maxExpense.day} (
            ${barInsights.maxExpense.amount})
          </p>
          <p>Balance promedio: ${Math.round(barInsights.balanceAvg)}</p>
        </div>
      </section>


      <section className="analysis-card">
        <h3>Evolución</h3>

        <LineChart width={700} height={300} data={timeSeriesData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line dataKey="ingresos" stroke="#00b894" />
          <Line dataKey="gastos" stroke="#d63031" />
        </LineChart>

        <div className="insights">
          <p>Tendencia ingresos: {lineInsights.trendIncome}</p>
          <p>
            Pico de gasto: {lineInsights.peakExpense.day} (
            ${lineInsights.peakExpense.amount})
          </p>
        </div>
      </section>

    </div>
  );
}
