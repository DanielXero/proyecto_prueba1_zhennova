import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/usersSlice";

export const NavBar = () => {
  const { user, isAuth } = useSelector((state) => state.users);
  const { items } = useSelector((state) => state.cart);

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };
  const cantidadTotal = items
    ? items.reduce((total, item) => total + item.cantidad, 0)
    : 0;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-primary">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src="/Logo completo mini.png"
            alt="ZhenNova Logo"
            style={{ height: "70px", marginRight: "0px" }}
          />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse " id="navbarContent">
          {/* Navegación Principal */}
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <NavLink className="nav-link fw-semibold mx-2" to="/">
                Inicio
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link fw-semibold mx-2" to="/productos">
                Productos
              </NavLink>{" "}
              {/* 👈 RUTA CORREGIDA */}
            </li>

            <li className="nav-item">
              <NavLink className="nav-link fw-semibold mx-2" to="/nosotros">
                Nosotros
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link fw-semibold mx-2" to="/contacto">
                Contacto
              </NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center">
            <form className="d-flex me-3 d-none d-lg-flex">
              <div className="input-group">
                <input
                  type="search"
                  className="form-control bg-dark text-white border-end-0"
                  placeholder="Buscar productos..."
                  style={{ minWidth: "250px" }}
                />
                <button
                  className="btn btn-outline-primary border-start-0"
                  type="submit"
                >
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </form>

            {isAuth ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-light dropdown-toggle d-flex align-items-center gap-2"
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-person-circle"></i>
                  <span>{user?.username || user?.name || "Usuario"}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end">
                  <li>
                    <span className="dropdown-item-text small">
                      {user?.email}
                    </span>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  {user?.rol === "admin" && (
                    <li>
                      <Link className="dropdown-item" to="/admin/productos">
                        <i className="bi bi-grid me-2"></i> Panel de
                        Administración
                      </Link>
                    </li>
                  )}
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              // SI NO ESTÁ LOGUEADO: Muestra botón de Ingresar
              <Link to="/login" className="btn btn-primary fw-bold">
                Ingresar
              </Link>
            )}

            <Link
              to="/cart"
              className="btn btn-outline-warning position-relative ms-3"
              title="Carrito de Compras"
            >
              <i className="bi bi-cart-fill"></i>
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cantidadTotal}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
