import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/productsSlice";
import { ProductItem } from "./ProductItem";
import { ProductSkeleton } from "./ProductSkeleton";
import { CategoryFilter } from './CategoryFilter';

export const ProductList = () => {
  const dispatch = useDispatch();
  const { searchTerm, selectedCategoria, loading, products, error } =
    useSelector((state) => state.products);

  useEffect(() => {
    dispatch(
      fetchProducts({ search: searchTerm, categoria: selectedCategoria }),
    );
  }, [dispatch, searchTerm, selectedCategoria]);

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
  <div className="row">
    <div className="col-md-3">
      <CategoryFilter />
    </div>
    <div className="col-md-9">
      <h2 className="text-white mb-4 fw-bold">Nuestro Catálogo</h2>
      {renderContent()}
    </div>
  </div>
</div>
  );
};
