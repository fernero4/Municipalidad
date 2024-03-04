import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModalAgregarSubsidio from './ModalAgregarSubsidio';
import ModalAgregarOficina from './ModalAgregarOficina';
import { useNavigate } from "react-router-dom";

function SubsidioForm() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [subsidios, setSubsidios] = useState([]);
  const [mostrarModalSubsidio, setMostrarModalSubsidio] = useState(false);
  const [mostrarModalOficina, setMostrarModalOficina] = useState(false);
  const [mostrarModalConfirmacion, setMostrarModalConfirmacion] = useState(false);
  const [idSubsidioEliminar, setIdSubsidioEliminar] = useState(null);
  const [filtroPersona, setFiltroPersona] = useState(false);
  const [filtroOficinaFecha, setFiltroOficinaFecha] = useState(false);
  const [oficinas, setOficinas] = useState([]);
  
  const [filtros, setFiltros] = useState({
    filtroPersona: '',
    filtroOficina: '',
    fechaInicio: '',
    fechaFin: ''
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    cargarOficinas();
    axios.get('http://127.0.0.1:8000/subsidios/subsidio/', {
      headers: {
        Authorization: `Token ${token}`,
      },
      params: filtros
    })
      .then(response => {
        setSubsidios(response.data);
      })
      .catch(error => {
        console.error('Error al obtener subsidios:', error);
      });
  }, [filtros, navigate, token]);

  const agregarNuevaOficina = () => {
    setMostrarModalOficina(true);
  };

  const handleAceptarSubsidio = (nuevoSubsidio) => {
    setSubsidios([...subsidios, nuevoSubsidio]);
    setMostrarModalSubsidio(false);
  };

  const handleCancelarSubsidio = () => {
    setMostrarModalSubsidio(false);
  };

  const handleChangeFiltroPersona = (e) => {
    setFiltroPersona(e.target.checked);
    setFiltroOficinaFecha(false); 
  };

  const handleChangeFiltroOficinaFecha = (e) => {
    setFiltroOficinaFecha(e.target.checked);
    setFiltroPersona(false); 
  };

  const cargarOficinas = () => {
    axios.get('http://127.0.0.1:8000/subsidios/oficina/', {
      headers: {
        Authorization: `Token ${token}`,
      },
      params: filtros
    })
      .then(response => {
        setOficinas(response.data);
      })
      .catch(error => {
        console.error('Error al obtener oficinas:', error);
      });
  };

  const getDatosGrilla = () => {
    axios.get('http://127.0.0.1:8000/subsidios/subsidio/', {
      headers: {
        Authorization: `Token ${token}`,
      },
      params: filtros
    })
      .then(response => {
        setSubsidios(response.data);
      })
      .catch(error => {
        console.error('Error al obtener subsidios:', error);
      });
  };


  const handleFiltrar = () => {
    let url = 'http://127.0.0.1:8000/subsidios/subsidio/';
    if (filtroPersona) {
      url = `http://127.0.0.1:8000/subsidios/listarporpersona/${filtros.filtroPersona}/`;
    } else if (filtroOficinaFecha) {
      url = `http://127.0.0.1:8000/subsidios/listarsubsidio/${filtros.filtroOficina}/${filtros.fechaInicio}/${filtros.fechaFin}/`;
    }
  
    axios.get(url, {
      headers: {
        Authorization: `Token ${token}`,
      }
    })
      .then(response => {
        setSubsidios(response.data);
      })
      .catch(error => {
        console.error('Error al obtener subsidios:', error);
      });
  };

  const handleChangeFiltro = (e) => {
    const { name, value } = e.target;
    setFiltros({
      ...filtros,
      [name]: value
    });
  };

  const handleAceptarOficina = () => {
    setMostrarModalOficina(false);
    cargarOficinas(); 
  };

  const handleCancelarOficina = () => {
    setMostrarModalOficina(false);
  };

  const handleConfirmarEliminacion = () => {
    if (idSubsidioEliminar) {
      axios.delete(`http://127.0.0.1:8000/subsidios/subsidio/${idSubsidioEliminar}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
        .then(() => {
          getDatosGrilla(); 
          setMostrarModalConfirmacion(false);
          setIdSubsidioEliminar(null); 
        })
        .catch(error => {
          console.error('Error al eliminar subsidio:', error);
          setMostrarModalConfirmacion(false);
          setIdSubsidioEliminar(null); 
        });
    }
  };
  

  return (
    <div>
      <h1>Subsidios App</h1>
      {mostrarModalSubsidio && (
        <ModalAgregarSubsidio
          onAceptar={(nuevoSubsidio) => handleAceptarSubsidio(nuevoSubsidio)}
          onCancelar={handleCancelarSubsidio}
          token={token}
        />
      )}
      {mostrarModalOficina && (
        <ModalAgregarOficina
          onAceptar={handleAceptarOficina}
          onCancelar={handleCancelarOficina}
          token={token}
        />
      )}
      {mostrarModalConfirmacion && (
        <div className="modal-container">
          <div className="modal-content">
            <h2>Confirmar Eliminación</h2>
            <p>¿Está seguro de que desea eliminar este subsidio?</p>
            <div className="modal-buttons">
              <button onClick={handleConfirmarEliminacion}>Aceptar</button>
              <button onClick={() => setMostrarModalConfirmacion(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
<div className="filtros-container">
  <h2 className="filtros-h2">Filtros</h2>
  <div className="checkbox-container">
    <label>
    <input
        type="checkbox"
        name="filtroPersona"
        checked={filtroPersona}
        onChange={handleChangeFiltroPersona}
      />      
      Persona
    </label>
  </div>
  <div className="filtro-item">
    <label>Persona:</label>
    <input type="text" name="filtroPersona" value={filtros.filtroPersona} onChange={handleChangeFiltro} disabled={!filtroPersona} />
  </div>
  <div className="checkbox-container">
    <label>
      <input type="checkbox" checked={filtroOficinaFecha} onChange={handleChangeFiltroOficinaFecha} />
      Oficina y Fecha
    </label>
  </div>
  <div className="filtro-item">
    <label>Oficina:</label>
    <select name="filtroOficina" value={filtros.filtroOficina} onChange={handleChangeFiltro} disabled={!filtroOficinaFecha}>
    <option value="">Seleccionar Oficina</option>
    {oficinas.map(oficina => (
      <option key={oficina.id} value={oficina.id}>{oficina.nombre}</option>
    ))}
  </select>
  
  </div>
  <div className="filtro-item">
    <label>Fecha Inicio:</label>
    <input type="date" name="fechaInicio" value={filtros.fechaInicio} onChange={handleChangeFiltro} disabled={!filtroOficinaFecha} />
  </div>
  <div className="filtro-item">
    <label>Fecha Fin:</label>
    <input type="date" name="fechaFin" value={filtros.fechaFin} onChange={handleChangeFiltro} disabled={!filtroOficinaFecha} />
  </div>
  <div className="filtro-item-buttom">
    <button onClick={handleFiltrar}>Filtrar</button>
  </div>
</div>
    <button onClick={agregarNuevaOficina}>Agregar Oficina</button>
    <button onClick={() => setMostrarModalSubsidio(true)}>Agregar Subsidio</button>
    <SubsidiosGrid subsidios={subsidios} setSubsidios={setSubsidios} setMostrarModalConfirmacion={setMostrarModalConfirmacion} setIdSubsidioEliminar={setIdSubsidioEliminar} />
  </div>
  );
}

function SubsidiosGrid({ subsidios, setSubsidios, setMostrarModalConfirmacion, setIdSubsidioEliminar }) {
  return (
    <div>
      <h2>Grilla de Subsidios</h2>
      {subsidios.length === 0 ? (
        <p>No hay subsidios registrados.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Descripción</th>
              <th>Oficina Solicitante</th>
              <th>Fecha Alta</th>
              <th>Año</th>
              <th>Mes</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {subsidios.map(subsidio => (
              <tr key={subsidio.id}>
                <td>{subsidio.id_subsidio}</td>
                <td>{subsidio.descripcion}</td>
                <td>{subsidio.oficina_solicitante_nombre}</td>
                <td>{subsidio.fecha_alta}</td>
                <td>{subsidio.anio}</td>
                <td>{subsidio.mes}</td>
                <td>{subsidio.estado}</td>
                <td>
                  <button onClick={() => {
                    setIdSubsidioEliminar(subsidio.id_subsidio);
                    setMostrarModalConfirmacion(true);
                  }}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SubsidioForm;
