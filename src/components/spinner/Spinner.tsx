import React from 'react';
import './Spinner.scss';

const Spinner: React.FC = () => {
  return (
    <div className="spinner-overlay">
      <img src="/football.png" alt="Loading" className="spinner-image" />
    </div>
  );
};

export default Spinner;
