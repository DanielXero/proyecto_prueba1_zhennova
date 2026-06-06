import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../store/usersSlice";
import { useNavigate, Link } from "react-router-dom";
import { BiLogIn, BiUser, BiLockAlt } from "react-icons/bi";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuth, error, loading } = useSelector((state) => state.users);

  useEffect(() => {
    if (isAuth) navigate("/");
    return () => {
      dispatch(clearError());
    };
  }, [isAuth, navigate, dispatch]);

  // Cuando llega un error del backend (credenciales inválidas)
  // resaltamos ambos campos (email y password) sin revelar cuál es el incorrecto
  useEffect(() => {
    if (error === "Credenciales inválidas") {
      setError("email", { type: "manual", message: " " });
      setError("password", { type: "manual", message: " " });
    }
  }, [error, setError]);

  const onSubmit = (data) => {
    dispatch(loginUser(data));
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light py-5">
      <div
        className="card shadow-lg border-0 rounded-4 p-4"
        style={{ maxWidth: "400px", width: "100%", backgroundColor: "#1a1a1a" }}
      >
        <div className="card-body text-center">
          <div className="mb-4">
            <div className="bg-dark d-inline-block p-3 rounded-circle border border-info shadow">
              <BiLogIn size={40} color="#00d2ff" />
            </div>
          </div>
          <h3 className="fw-bold text-white mb-1">Bienvenido</h3>
          <p className="text-secondary small">Ingresa tus credenciales</p>
        </div>

        {error && error !== "Credenciales inválidas" && (
          <div className="alert alert-danger alert-dismissible fade show py-2" role="alert">
            <strong>{error}</strong>
            <button type="button" className="btn-close" onClick={() => dispatch(clearError())}></button>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label text-secondary small">Email</label>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary text-secondary">
                <BiUser />
              </span>
              <input
                type="email"
                className={`form-control bg-dark text-white ${errors.email ? "border-danger" : "border-secondary"}`}
                placeholder="ejemplo@correo.com"
                {...register("email", { required: "Email obligatorio" })}
              />
            </div>
            {errors.email && errors.email.message !== " " && (
              <span className="text-danger small">{errors.email.message}</span>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label text-secondary small">Contraseña</label>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary text-secondary">
                <BiLockAlt />
              </span>
              <input
                type="password"
                className={`form-control bg-dark text-white ${errors.password ? "border-danger" : "border-secondary"}`}
                placeholder="••••••••"
                {...register("password", { required: "Contraseña obligatoria" })}
              />
            </div>
            {errors.password && errors.password.message !== " " && (
              <span className="text-danger small">{errors.password.message}</span>
            )}
          </div>

          {/* Mensaje de error general solo para credenciales inválidas */}
          {error === "Credenciales inválidas" && (
            <div className="alert alert-warning py-1 small text-center">
              Email o contraseña incorrectos. Verifica tus datos.
            </div>
          )}

          <button
            type="submit"
            className="btn btn-info w-100 fw-bold text-dark py-2"
            disabled={loading === "loading"}
          >
            {loading === "loading" ? "Ingresando..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className="text-center mt-3">
          <p className="text-secondary small">
            ¿No tienes cuenta? <Link to="/register" className="text-info">Regístrate</Link>
          </p>
          <p className="mt-2">
            <Link to="/forgot-password" className="text-info small">¿Olvidaste tu contraseña?</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;