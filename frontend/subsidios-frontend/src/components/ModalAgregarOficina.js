import React, { useState } from 'react';
import axios from 'axios';

function ModalAgregarOficina({ onAceptar, onCancelar, token }) {
  const [nombreOficina, setNombreOficina] = useState('');

  const handleAceptar = () => {
    axios.post(
      'http://127.0.0.1:8000/subsidios/oficina/',
      { nombre: nombreOficina },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    )
      .then(response => {
        onAceptar(response.data);
        setNombreOficina('');
      })
      .catch(error => {
        console.error('Error al agregar oficina:', error);
      });
  };

  return (
    <div className="modal">
      <div className="modal-content modal-content-oficina">
        <h2>Agregar Nueva Oficina</h2>
        <label>Nombre de la Oficina:</label>
        <input type="text" value={nombreOficina} onChange={(e) => setNombreOficina(e.target.value)} />
        <div>
          <button onClick={handleAceptar}>Aceptar</button>
          <button onClick={onCancelar}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default ModalAgregarOficina;
