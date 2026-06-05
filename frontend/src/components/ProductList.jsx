import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/productsSlice";
import { ProductItem } from "./ProductItem";
import { ProductSkeleton } from "./ProductSkeleton";

export const ProductList = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    if (loading === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, loading]);

  const renderContent = () => {
    if (loading === "loading") {
      return (
        <div className="row">
          {[1, 2, 3].map((i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="alert alert-danger text-center mt-4">
          <i className="bi bi-x-octagon-fill me-2"></i> Error: {error}
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className="alert alert-info text-center mt-4">
          <i className="bi bi-info-circle-fill me-2"></i> No hay productos
          disponibles.
        </div>
      );
    }

    return (
      <div className="row">
        {products.map((product) => (
          <ProductItem key={product.id_producto} product={product} />
        ))}
      </div>
    );
  };

  return (
    <div className="container py-5">
      <h2 className="text-center text-white mb-4 fw-bold">
        Nuestro Catálogo <span className="text-cyan">de Componentes</span>
      </h2>
      <p className="text-center text-secondary mb-5 lead">
        Encuentra lo último en hardware y periféricos.
      </p>
      {renderContent()}
    </div>
  );
};
