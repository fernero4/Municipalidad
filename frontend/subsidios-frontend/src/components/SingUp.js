import React, { useState } from 'react';
import axios from 'axios';

function SignUpForm({ onSubmit, onChange, formData }) {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();

    const { email, password } = formData;

    try {
      await axios.post('http://127.0.0.1:8000/users/registro/', {
        email: email,
        password: password
      });

      setShowSuccessMessage(true);
      setShowSuccessModal(true);

      onChange({
        target: {
          name: 'email',
          value: ''
        }
      });

      onChange({
        target: {
          name: 'password',
          value: ''
        }
      });

    } catch (error) {
      alert('Error al registrar usuario');
      console.error(error);
    }
  };

  const closeModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Crear Cuenta</h1>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={onChange}
          placeholder="Password"
          required
        />
        <button type="submit">Registrarse</button>
      </form>
      {showSuccessMessage && <p>Usuario creado correctamente</p>}
      {showSuccessModal && (
        <div className="modal">
          <div className="modal-content">
            <p>Usuario creado correctamente</p>
            <button onClick={closeModal}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignUpForm;
