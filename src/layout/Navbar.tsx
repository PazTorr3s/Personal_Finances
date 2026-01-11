import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="nav">
      <h1>Control Financiero Personal</h1>
      <ul style={{ display: "flex", gap: "20px", listStyle: "none" }}>
        <li>
          <NavLink to="/" style={({isActive}) => ({opacity: isActive ? 1 : 0.7, fontWeight: isActive ? "bold" : "normal", color:"white"})}>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/analysis" style={({isActive}) => ({opacity: isActive ? 1 : 0.7, fontWeight: isActive ? "bold" : "normal", color:"white"})}>
            Análisis
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
