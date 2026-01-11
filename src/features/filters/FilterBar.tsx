import { useFilterStore } from "./filter.store";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale";

registerLocale("es", es);

export default function FilterBar() {
  const { mode, selectedDate, setMode, setSelectedDate } = useFilterStore();

  return (
    <div className="filter-bar">
      <div className="filter-type">
        {["day", "week", "month", "year"].map((m) => (
          <button key={m} className={mode === m ? "active" : ""} onClick={() => setMode(m as any)}>
            {m === "day" && "Día"}
            {m === "week" && "Semana"}
            {m === "month" && "Mes"}
            {m === "year" && "Año"}
          </button>
        ))}
      </div>

      <div className="filter-date">
        {mode === "day" && (
        <DatePicker locale="es"selected={selectedDate}
          onChange={(date: Date | null) => {
            if (date) setSelectedDate(date);
          }}
          dateFormat="dd/MM/yyyy"
          className="filter-input"
        />
        )}

        {mode === "week" && (
        <DatePicker locale="es" selected={selectedDate} 
          onChange={(date: Date | null) => {
            if (date) setSelectedDate(date);
          }}
          showWeekNumbers
          showWeekPicker
          dateFormat="'Semana' w, yyyy"
          className="filter-input"
        />
        )}

        {mode === "month" && (
        <DatePicker locale="es" selected={selectedDate}
          onChange={(date: Date | null) => {
            if (date) setSelectedDate(date);
          }}
          showMonthYearPicker
          dateFormat="MMMM yyyy"
          className="filter-input"
        />
        )}

        {mode === "year" && (
        <DatePicker locale="es" selected={selectedDate}
          onChange={(date: Date | null) => {
            if (date) setSelectedDate(date);
          }}
          showYearPicker
          dateFormat="yyyy"
          className="filter-input"
        />
        )}
      </div>
    </div>
  );
}
