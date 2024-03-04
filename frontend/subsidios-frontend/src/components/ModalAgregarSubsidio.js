import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function ModalAgregarSubsidio({ onAceptar, onCancelar, token }) {
  const navigate = useNavigate();
  const [nuevoSubsidio, setNuevoSubsidio] = useState({
    descripcion: '',
    oficina_solicitante_nombre: '',
    anio: '',
    mes: ''
  });
  const [oficinasDisponibles, setOficinasDisponibles] = useState([]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    axios.get('http://127.0.0.1:8000/subsidios/oficina/', {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then(response => {
        setOficinasDisponibles(response.data);
      })
      .catch(error => {
        console.error('Error al obtener oficinas:', error);
      });
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoSubsidio({
      ...nuevoSubsidio,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:8000/subsidios/subsidio/', nuevoSubsidio, {
      headers: {
        Authorization: `Token ${token}`
      }
    })
      .then(response => {
        onAceptar(response.data);
        setNuevoSubsidio({
          descripcion: '',
          oficina_solicitante_nombre: '',
          anio: '',
          mes: ''
        });
      })
      .catch(error => {
        console.error('Error al agregar subsidio:', error);
      });
  };

  return (
    <div className="modal-container">
      <div className="modal-content">
        <h2>Agregar Subsidio</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Descripción:
            <input type="text" name="descripcion" value={nuevoSubsidio.descripcion} onChange={handleChange} />
          </label>
          <label>
            Oficina Solicitante:
            <select
              name="oficina_solicitante_nombre"
              value={nuevoSubsidio.oficina_solicitante_nombre}
              onChange={handleChange}
            >
              {oficinasDisponibles.map((oficina) => (
                <option key={oficina.id} value={oficina.nombre}>
                  {oficina.nombre}
                </option>
              ))}
            </select>
          </label>
          <label>
            Año:
            <input type="text" name="anio" value={nuevoSubsidio.anio} onChange={handleChange} />
          </label>
          <label>
            Mes:
            <input type="text" name="mes" value={nuevoSubsidio.mes} onChange={handleChange} />
          </label>
          <div className="modal-buttons">
            <button type="submit">Aceptar</button>
            <button type="button" onClick={onCancelar}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalAgregarSubsidio;
