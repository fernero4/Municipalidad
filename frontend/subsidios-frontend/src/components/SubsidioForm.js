import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModalAgregarSubsidio from './ModalAgregarSubsidio';
import ModalAgregarOficina from './ModalAgregarOficina';
import ModalAgregarBeneficiario from './ModalAgregarBeneficiario';
import ModalAgregarSubsidioDetalle from './ModalAgregarSubsidioDetalle';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';


import { useNavigate } from "react-router-dom";

function SubsidioForm() {
  const navigate = useNavigate();
  // este token es el que se guarda en el localStorage
  const token = localStorage.getItem('token');

  const [idSubsidioEliminar, setIdSubsidioEliminar] = useState(null);
  const [subsidios, setSubsidios] = useState([]);

  // Estados para manejar los datos de para los desplegables de oficinas y beneficiarios
  const [oficinas, setOficinas] = useState([]);
  const [beneficiarios, setBeneficiarios] = useState([]); 

  // Estados para manejar los modales de agregar subsidio, oficina, beneficiario, subsidioDetalle y confirmación para eliminar
  const [mostrarModalSubsidio, setMostrarModalSubsidio] = useState(false);
  const [mostrarModalBeneficiario, setMostrarModalBeneficiario] = useState(false);
  const [mostrarModalOficina, setMostrarModalOficina] = useState(false);
  const [mostrarModalConfirmacion, setMostrarModalConfirmacion] = useState(false);
  const [mostrarModalSubsidioDetalle, setMostrarModalSubsidioDetalle] = useState(false); 

  const [filtroPersona, setFiltroPersona] = useState(false);
  const [filtroOficinaFecha, setFiltroOficinaFecha] = useState(false);



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
    cargarBeneficiarios();
    getDatosGrilla();
    axios.get('http://127.0.0.1:8000/subsidios/subsidiogrilla/', {
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

 // Manejo de oficina
  const handleAceptarOficina = () => {
    setMostrarModalOficina(false);
    cargarOficinas(); 
  };

  const handleCancelarOficina = () => {
    setMostrarModalOficina(false);
  };

  const agregarNuevaOficina = () => {
    setMostrarModalOficina(true);
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
    axios.get('http://127.0.0.1:8000/subsidios/subsidiogrilla/', {
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
  
  // Manejo de beneficiario
  const handleMostrarModalBeneficiario = () => {
    setMostrarModalBeneficiario(true);
  };

  const handleCancelarBeneficiario = () => {
    setMostrarModalBeneficiario(false); // Cierra el modal si se cancela
  };

  const handleAceptarBeneficiario = (nuevoBeneficiario) => {
    axios.post('http://127.0.0.1:8000/subsidios/beneficiario/', nuevoBeneficiario, {
      headers: {
        Authorization: `Token ${token}`,
      }
    })
    .then(response => {
      setMostrarModalBeneficiario(false); 
    })
    .catch(error => {
      console.error('Error al agregar beneficiario:', error);
    });
  };

  const cargarBeneficiarios = () => {
    axios.get('http://127.0.0.1:8000/subsidios/beneficiario/', {
      headers: {
        Authorization: `Token ${token}`,
      }
    })
      .then(response => {
        setBeneficiarios(response.data);
      })
      .catch(error => {
        console.error('Error al obtener beneficiarios:', error);
      });
  };


  // Manejo de subsidio detalle
  const handleMostrarModalSubsidioDetalle = () => {
    setMostrarModalSubsidioDetalle(true);
  };

  const handleCancelarSubsidioDetalle = () => {
    setMostrarModalSubsidioDetalle(false);
  };

  const handleAceptarSubsidioDetalle = (nuevoSubsidioDetalle) => {
    axios.post('http://127.0.0.1:8000/subsidios/subsidiodetalle/', nuevoSubsidioDetalle, {
      headers: {
        Authorization: `Token ${token}`,
      }
    })
    .then(response => {
      setMostrarModalSubsidioDetalle(false);
    })
    .catch(error => {
      console.error('Error al agregar subsidio detalle:', error);
    });
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text('Subsidios', 10, 10);
    subsidios.forEach((subsidio, index) => {
      let posY = 20 + index * 40; 
      doc.text(`${index + 1}. ID: ${subsidio.id_subsidio}`, 10, posY);
      posY += 5;
      doc.text(`   Descripción: ${subsidio.descripcion}`, 10, posY);
      posY += 5;
      doc.text(`   Oficina Solicitante: ${subsidio.oficina_solicitante_nombre}`, 10, posY);
      posY += 5;
      doc.text(`   Fecha Alta: ${subsidio.fecha_alta}`, 10, posY);
      posY += 5;
      doc.text(`   Año: ${subsidio.anio}`, 10, posY);
      posY += 5;
      doc.text(`   Mes: ${subsidio.mes}`, 10, posY);
      posY += 5;
      doc.text(`   Estado: ${subsidio.estado}`, 10, posY);
      posY += 15;
    });
    doc.save('subsidios.pdf');
};


  const exportarExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(subsidios);
    XLSX.utils.book_append_sheet(wb, ws, 'Subsidios');
    XLSX.writeFile(wb, 'subsidios.xlsx');
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
      {mostrarModalBeneficiario && (
        <ModalAgregarBeneficiario
          onAceptar={handleAceptarBeneficiario}
          onCancelar={handleCancelarBeneficiario}
        />
      )}
      {mostrarModalSubsidioDetalle && (
      <ModalAgregarSubsidioDetalle
        onAceptar={handleAceptarSubsidioDetalle}
        onCancelar={handleCancelarSubsidioDetalle}
        beneficiarios={beneficiarios} 
        subsidios={subsidios} 
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
    <button onClick={handleMostrarModalBeneficiario}>Agregar Beneficiario</button>
    <button onClick={handleMostrarModalSubsidioDetalle}>Agregar Detalle</button>
    <button onClick={() => setMostrarModalSubsidio(true)}>Agregar Subsidio</button>
    <button onClick={exportarPDF}>Exportar a PDF</button>
    <button onClick={exportarExcel}>Exportar a Excel</button>
    <SubsidiosGrid subsidios={subsidios} setSubsidios={setSubsidios} setMostrarModalConfirmacion={setMostrarModalConfirmacion} setIdSubsidioEliminar={setIdSubsidioEliminar} />
  </div>
  );
}

function SubsidiosGrid({ subsidios, setSubsidios, setMostrarModalConfirmacion, setIdSubsidioEliminar }) {

  const [detallesVisibles, setDetallesVisibles] = useState({});
  const handleToggleDetalles = (idSubsidio) => {
    setDetallesVisibles(prevState => ({
      ...prevState,
      [idSubsidio]: !prevState[idSubsidio]
    }));
  };

  const handleImprimir = (idSubsidio) => {
      window.open(`http://127.0.0.1:8000/subsidios/imprimir_subsidio/${idSubsidio}`, '_blank');
  };
  
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
              <th>Detalles</th> 
            </tr>
          </thead>
          <tbody>
            {subsidios.map(subsidio => (
              <React.Fragment key={subsidio.id}>
                <tr>
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
                    <button onClick={() => handleImprimir(subsidio.id_subsidio)}>Imprimir</button>
                  </td>
                  <td>
                    <button onClick={() => handleToggleDetalles(subsidio.id_subsidio)}>
                      {detallesVisibles[subsidio.id_subsidio] ? 'Ocultar Detalles' : 'Mostrar Detalles'}
                    </button>
                  </td>
                </tr>
                {detallesVisibles[subsidio.id_subsidio] && (
                  <tr>
                    <td colSpan="8"> {/*  */}
                      <h3>Detalles del Subsidio</h3>
                      <p>Importe: {subsidio.importe}</p>
                      <p>Estado: {subsidio.estado_detalle}</p>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SubsidioForm;

