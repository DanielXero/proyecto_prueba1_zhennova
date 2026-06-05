import React from 'react';

export const ProductSkeleton = () => {
  return (
    <div className="col-md-4 mb-4">
      <div className="card bg-dark text-white border-secondary">
        <div className="card-body">
          <div className="placeholder-glow">
            <h5 className="placeholder col-8 bg-secondary"></h5>
            <p className="placeholder col-10 bg-secondary mt-2"></p>
            <p className="placeholder col-6 bg-secondary"></p>
            <p className="placeholder col-4 bg-secondary"></p>
            <div className="d-flex gap-2 mb-2">
              <div className="placeholder col-4 bg-secondary"></div>
            </div>
            <button className="btn btn-outline-secondary w-100 disabled placeholder"></button>
          </div>
        </div>
      </div>
    </div>
  );
};