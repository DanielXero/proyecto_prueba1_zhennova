import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../store/usersSlice";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
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
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuth, errorDetails } = useSelector(
    (state) => state.users
  );

  const [passwordStrength, setPasswordStrength] = useState(0);
  const password = watch("password", "");

  const checkStrength = (pass) => {
    let score = 0;
    if (pass.length >= 6) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[@$!%*?&]/.test(pass)) score++;
    setPasswordStrength(score);
  };

  useEffect(() => {
    if (isAuth) navigate("/");
    return () => {
      dispatch(clearError());
    };
  }, [isAuth, navigate, dispatch]);

  // Mapear errores del backend a campos específicos
  useEffect(() => {
    if (errorDetails && Array.isArray(errorDetails)) {
      // Limpiar errores anteriores del backend para no duplicar
      clearErrors();
      errorDetails.forEach((errMsg) => {
        if (errMsg.includes("email")) setError("email", { type: "backend", message: errMsg });
        else if (errMsg.includes("nombre de usuario")) setError("nombre_usuario", { type: "backend", message: errMsg });
        else if (errMsg.includes("contraseña")) setError("password", { type: "backend", message: errMsg });
        else if (errMsg.includes("nombre") && !errMsg.includes("usuario")) setError("nombre", { type: "backend", message: errMsg });
        else {
          // Si no se puede mapear, se muestra en un alert general (solo por si acaso)
          toast.error(errMsg);
        }
      });
    }
  }, [errorDetails, setError, clearErrors]);

  const onSubmit = async (data) => {
    const { confirmPassword, ...userData } = data;
    const result = await dispatch(registerUser(userData));
    if (registerUser.fulfilled.match(result)) {
      toast.success("¡Cuenta creada! Por favor inicia sesión.");
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

        {/* Solo errores generales no mapeados */}
        {error && !errorDetails && (
          <div className="alert alert-danger alert-dismissible fade show py-2" role="alert">
            <strong>{error}</strong>
            <button type="button" className="btn-close" onClick={() => dispatch(clearError())}></button>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label text-secondary small">Nombre</label>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary"><BiIdCard /></span>
              <input
                type="text"
                className={`form-control bg-dark text-white ${errors.nombre ? "border-danger" : "border-secondary"}`}
                placeholder="Juan"
                {...register("nombre", { required: "Nombre obligatorio" })}
              />
            </div>
            {errors.nombre && <span className="text-danger small">{errors.nombre.message}</span>}
          </div>

          <div className="mb-3">
            <label className="form-label text-secondary small">Apellido</label>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary"><BiIdCard /></span>
              <input
                type="text"
                className="form-control bg-dark text-white border-secondary"
                placeholder="Perez"
                {...register("apellido")}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label text-secondary small">Usuario</label>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary"><BiUser /></span>
              <input
                type="text"
                className={`form-control bg-dark text-white ${errors.nombre_usuario ? "border-danger" : "border-secondary"}`}
                placeholder="juanperez123"
                {...register("nombre_usuario", { required: "Usuario obligatorio" })}
              />
            </div>
            {errors.nombre_usuario && <span className="text-danger small">{errors.nombre_usuario.message}</span>}
          </div>

          <div className="mb-3">
            <label className="form-label text-secondary small">Email</label>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary"><BiEnvelope /></span>
              <input
                type="email"
                className={`form-control bg-dark text-white ${errors.email ? "border-danger" : "border-secondary"}`}
                placeholder="ejemplo@correo.com"
                {...register("email", {
                  required: "Email obligatorio",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Email inválido" },
                })}
              />
            </div>
            {errors.email && <span className="text-danger small">{errors.email.message}</span>}
          </div>

          <div className="mb-3">
            <label className="form-label text-secondary small">Contraseña</label>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary"><BiLockAlt /></span>
              <input
                type="password"
                className={`form-control bg-dark text-white ${errors.password ? "border-danger" : "border-secondary"}`}
                placeholder="••••••••"
                {...register("password", {
                  required: "Contraseña obligatoria",
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/,
                    message: "Debe incluir mayúscula, minúscula y un número",
                  },
                })}
                onChange={(e) => checkStrength(e.target.value)}
              />
            </div>
            {errors.password && <span className="text-danger small">{errors.password.message}</span>}
            <div className="mt-1">
              <div className="progress" style={{ height: "4px" }}>
                <div className={`progress-bar ${passwordStrength >= 3 ? "bg-success" : passwordStrength >= 2 ? "bg-warning" : "bg-danger"}`} style={{ width: `${(passwordStrength / 4) * 100}%` }}></div>
              </div>
              <small className="text-secondary">
                Contraseña: {passwordStrength === 0 ? "Muy débil" : passwordStrength === 1 ? "Débil" : passwordStrength === 2 ? "Media" : "Fuerte"}
              </small>
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label text-secondary small">Confirmar contraseña</label>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary"><BiLockAlt /></span>
              <input
                type="password"
                className={`form-control bg-dark text-white ${errors.confirmPassword ? "border-danger" : "border-secondary"}`}
                placeholder="••••••••"
                {...register("confirmPassword", {
                  required: "Confirma tu contraseña",
                  validate: (value) => value === password || "Las contraseñas no coinciden",
                })}
              />
            </div>
            {errors.confirmPassword && <span className="text-danger small">{errors.confirmPassword.message}</span>}
          </div>

          <button type="submit" className="btn btn-info w-100 fw-bold text-dark py-2" disabled={loading === "loading"}>
            {loading === "loading" ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <div className="text-center mt-3">
          <p className="text-secondary small">¿Ya tienes cuenta? <Link to="/login" className="text-info">Inicia sesión</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;