import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { fetchProducts, setSelectedCategoria } from '../store/productsSlice';

export const CategoryFilter = () => {
  const dispatch = useDispatch();
  const [categorias, setCategorias] = useState([]);
  const { selectedCategoria } = useSelector(state => state.products);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/categorias');
        if (res.data.success) setCategorias(res.data.data);
      } catch (error) {
        console.error('Error al cargar categorías', error);
      }
    };
    fetchCategorias();
  }, []);

  const handleFilter = (categoriaId) => {
    const nuevaCategoria = categoriaId === selectedCategoria ? '' : categoriaId;
    dispatch(setSelectedCategoria(nuevaCategoria));
    dispatch(fetchProducts({ categoria: nuevaCategoria }));
  };

  return (
    <div className="card bg-dark border-secondary mb-4">
      <div className="card-body">
        <h5 className="card-title text-cyan">Categorías</h5>
        <div className="d-flex flex-wrap gap-2">
          <button
            className={`btn btn-sm ${selectedCategoria === '' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => handleFilter('')}
          >
            Todas
          </button>
          {categorias.map(cat => (
            <button
              key={cat.id_categoria}
              className={`btn btn-sm ${selectedCategoria === cat.id_categoria ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => handleFilter(cat.id_categoria)}
            >
              {cat.nombre}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};