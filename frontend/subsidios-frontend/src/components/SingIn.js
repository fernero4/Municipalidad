import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignInForm({ onSubmit, onChange, formData, setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();
  
    const { email, password } = formData;
  
    try {
      const response = await axios.post("http://127.0.0.1:8000/users/login/", {
        email: email,
        password: password
      });
  
      const { token } = response.data;
      localStorage.setItem("token", token);
  
      onChange({
        target: {
          name: "email",
          value: ""
        }
      });
  
      onChange({
        target: {
          name: "password",
          value: ""
        }
      });
  
      setIsLoggedIn(true);
      navigate("/subsidioform"); 
    } catch (error) {
      alert("Error al iniciar sesión");
      console.error(error);
    }
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Iniciar Sesión</h1>
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={onChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={onChange}
        />
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
}

export default SignInForm;
