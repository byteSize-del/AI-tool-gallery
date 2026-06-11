import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/home" className="navbar__brand">
        <span className="doodle">🎨</span>
        AI Tools Sketchbook
      </NavLink>
      <div className="navbar__links">
        <NavLink
          to="/home"
          className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
        >
          Categories
        </NavLink>
        <NavLink
          to="/learn"
          className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
        >
          Learn
        </NavLink>
        <NavLink
          to="/compare"
          className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
        >
          Compare
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
        >
          About
        </NavLink>
        <NavLink to="/" className="nav-link">
          Welcome
        </NavLink>
      </div>
    </nav>
  );
}
