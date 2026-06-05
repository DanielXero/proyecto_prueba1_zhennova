import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../store/usersSlice";
import { useNavigate, Link } from "react-router-dom";
import {
  BiUserPlus,
  BiUser,
  BiEnvelope,
  BiLockAlt,
  BiIdCard,
} from "react-icons/bi";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuth, errorDetails } = useSelector(
    (state) => state.users,
  );

  useEffect(() => {
    if (isAuth) navigate("/");
    return () => {
      dispatch(clearError());
    };
  }, [isAuth, navigate, dispatch]);

  const onSubmit = async (data) => {
    const result = await dispatch(registerUser(data));
    if (registerUser.fulfilled.match(result)) {
      alert("¡Cuenta creada! Por favor inicia sesión.");
      navigate("/login");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light py-5">
      <div
        className="card shadow-lg border-0 rounded-4 p-4"
        style={{ maxWidth: "450px", width: "100%", backgroundColor: "#1a1a1a" }}
      >
        <div className="card-body text-center">
          <div className="mb-4">
            <div className="bg-dark d-inline-block p-3 rounded-circle border border-info shadow">
              <BiUserPlus size={40} color="#00d2ff" />
            </div>
          </div>
          <h3 className="fw-bold text-white mb-1">Crear Cuenta</h3>
          <p className="text-secondary small">Únete a ZhenNova</p>
        </div>

        {error && (
          <div
            className="alert alert-danger alert-dismissible fade show py-2"
            role="alert"
          >
            <strong>{error}</strong>
            {errorDetails && errorDetails.length > 0 && (
              <ul className="mb-0 mt-2">
                {errorDetails.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            )}
            <button
              type="button"
              className="btn-close"
              onClick={() => dispatch(clearError())}
            ></button>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label text-secondary small">
              Nombre
            </label>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary">
                <BiIdCard />
              </span>
              {/* CORREGIDO: "name" a "nombre" */}
              <input
                type="text"
                className="form-control bg-dark text-white"
                placeholder="Juan"
                {...register("nombre", { required: "Nombre obligatorio" })}
              />
            </div>
            {errors.nombre && (
              <span className="text-danger small">{errors.nombre.message}</span>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label text-secondary small">Apellido</label>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary">
                <BiIdCard />
              </span>
              {/* CORREGIDO: "surname" a "apellido" */}
              <input
                type="text"
                className="form-control bg-dark text-white"
                placeholder="Perez"
                {...register("apellido")}
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label text-secondary small">Usuario</label>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary">
                <BiUser />
              </span>
              {/* CORREGIDO: "username" a "nombre_usuario" */}
              <input
                type="text"
                className="form-control bg-dark text-white"
                placeholder="juanperez123"
                {...register("nombre_usuario", {
                  required: "Usuario obligatorio",
                })}
              />
            </div>
            {errors.nombre_usuario && (
              <span className="text-danger small">
                {errors.nombre_usuario.message}
              </span>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label text-secondary small">Email</label>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary">
                <BiEnvelope />
              </span>
              <input
                type="email"
                className="form-control bg-dark text-white"
                placeholder="ejemplo@correo.com"
                {...register("email", {
                  required: "Email obligatorio",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Email inválido",
                  },
                })}
              />
            </div>
            {errors.email && (
              <span className="text-danger small">{errors.email.message}</span>
            )}
          </div>
          <div className="mb-4">
            <label className="form-label text-secondary small">
              Contraseña
            </label>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary">
                <BiLockAlt />
              </span>
              {/* CORREGIDO: Se agregó el pattern al frontend para avisar al usuario */}
              <input
                type="password"
                className="form-control bg-dark text-white"
                placeholder="••••••••"
                {...register("password", {
                  required: "Contraseña obligatoria",
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/,
                    message: "Debe incluir mayúscula, minúscula y un número",
                  },
                })}
              />
            </div>
            {errors.password && (
              <span className="text-danger small">
                {errors.password.message}
              </span>
            )}
          </div>
          <button
            type="submit"
            className="btn btn-info w-100 fw-bold text-dark py-2"
            disabled={loading === "loading"}
          >
            {loading === "loading" ? "Registrando..." : "Registrarse"}
          </button>
        </form>
        <div className="text-center mt-3">
          <p className="text-secondary small">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-info">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
