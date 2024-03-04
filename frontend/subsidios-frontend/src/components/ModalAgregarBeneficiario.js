import React, { useState } from 'react';

const ModalAgregarBeneficiario = ({ onAceptar, onCancelar }) => {
  const [nuevoBeneficiario, setNuevoBeneficiario] = useState({
    tipo_documento: '',
    numero_documento: '',
    apellido: '',
    nombre: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoBeneficiario(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAceptar(nuevoBeneficiario);
  };

  return (
    <div className="modal-container">
      <div className="modal-content">
        <h2>Agregar Beneficiario</h2>
        <form onSubmit={handleSubmit}>
          <label>Tipo de Documento:</label>
          <input type="text" name="tipo_documento" value={nuevoBeneficiario.tipo_documento} onChange={handleChange} />
          <label>Número de Documento:</label>
          <input type="text" name="numero_documento" value={nuevoBeneficiario.numero_documento} onChange={handleChange} />
          <label>Apellido:</label>
          <input type="text" name="apellido" value={nuevoBeneficiario.apellido} onChange={handleChange} />
          <label>Nombre:</label>
          <input type="text" name="nombre" value={nuevoBeneficiario.nombre} onChange={handleChange} />
          <div className="modal-buttons">
            <button type="submit">Aceptar</button>
            <button type="button" onClick={onCancelar}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAgregarBeneficiario;
