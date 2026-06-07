import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminPanel from "./pages/AdminPanel";
import ProtectedRoute from "./components/ProtectedRoute";
import { ProductList } from "./components/ProductList";
import { Routes, Route } from "react-router-dom";
import Cart from "./pages/Cart";
import ThankYou from "./pages/ThankYou";
import Nosotros from "./pages/AboutUs";
import Contacto from "./pages/Contact";
import MisPedidos from "./pages/MyOrders";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/productos" element={<ProductList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/gracias/:pedidoId" element={<ThankYou />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route
            path="/admin/productos"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mis-pedidos"
            element={
              <ProtectedRoute>
                <MisPedidos />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
