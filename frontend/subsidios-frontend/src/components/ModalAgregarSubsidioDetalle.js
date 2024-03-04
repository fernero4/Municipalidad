import React, { useState } from 'react';

const ModalAgregarSubsidioDetalle = ({ onAceptar, onCancelar, beneficiarios, subsidios }) => {
  const [nuevoSubsidioDetalle, setNuevoSubsidioDetalle] = useState({
    id_subsidio: '',
    id_beneficiario: '',
    importe: '',
    estado: 'Alta'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoSubsidioDetalle(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAceptar(nuevoSubsidioDetalle);
  };

  return (
    <div className="modal-container">
      <div className="modal-content">
        <h2>Agregar Subsidio Detalle</h2>
        <form onSubmit={handleSubmit}>
          <label>Subsidio:</label>
          <select name="id_subsidio" value={nuevoSubsidioDetalle.id_subsidio} onChange={handleChange}>
            <option value="">Seleccionar Subsidio</option>
            {subsidios.map(subsidio => (
              <option key={subsidio.id_subsidio} value={subsidio.id_subsidio}>{subsidio.descripcion}</option>
            ))}
          </select>
          <label>Beneficiario:</label>
          <select name="id_beneficiario" value={nuevoSubsidioDetalle.id_beneficiario} onChange={handleChange}>
            <option value="">Seleccionar Beneficiario</option>
            {beneficiarios.map(beneficiario => (
              <option key={beneficiario.id_beneficiario} value={beneficiario.id_beneficiario}>{beneficiario.apellido}, {beneficiario.nombre}</option>
            ))}
          </select>
          <label>Importe:</label>
          <input type="number" name="importe" value={nuevoSubsidioDetalle.importe} onChange={handleChange} />
          <div className="modal-buttons">
            <button type="submit">Aceptar</button>
            <button type="button" onClick={onCancelar}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAgregarSubsidioDetalle;
