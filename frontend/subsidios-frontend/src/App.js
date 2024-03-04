import React, { useState } from "react";
import "./styles/style.css";
import SignUpForm from './components/SingUp';
import SignInForm from './components/SingIn'; 
import SubsidioForm from './components/SubsidioForm';
import axios from "axios";
import { BrowserRouter as Router, Route, Switch, Routes, Link } from 'react-router-dom';

export default function App() {
  const [type, setType] = useState("signIn");
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleOnClick = text => {
    if (text !== type) {
      setType(text);
    }
  };

  const handleChange = evt => {
    const { name, value } = evt.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();

    const { email, password } = formData;

    try {
      let url = "";
      if (type === "signUp") {
        url = "http://127.0.0.1:8000/users/registro/";
      } else if (type === "signIn") {
        url = "http://127.0.0.1:8000/users/login/";
      }

      const response = await axios.post(url, {
        email: email,
        password: password
      });

      alert("Usuario registrado exitosamente");

      setFormData({
        email: "",
        password: ""
      });

      setIsLoggedIn(true); 
    } catch (error) {
      alert("Error al registrar usuario");
      console.error(error);
    }
  };

  const containerClass =
    "container " + (type === "signUp" ? "right-panel-active" : "");

  return (
    <Router>
      <div className="App">
        {isLoggedIn ? (
          <SubsidioForm />
        ) : (
          <div className={containerClass} id="container">
            {type === "signIn" ? (
              <SignInForm onSubmit={handleOnSubmit} onChange={handleChange} formData={formData} setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <SignUpForm onSubmit={handleOnSubmit} onChange={handleChange} formData={formData} />
            )}
            <div className="overlay-container">
              <div className="overlay">
                <div className="overlay-panel overlay-left">
                  <h1> Iniciar Sesión</h1>
                  <p>
                    Si ya posee una cuenta por favor inicie sesión
                  </p>
                  <button
                    className="ghost"
                    id="signIn"
                    onClick={() => handleOnClick("signIn")}
                  >
                    Iniciar Sesión
                  </button>
                </div>
                <div className="overlay-panel overlay-right">
                  <h1>Bienvenido!</h1>
                  <p>Si no posee una cuenta por favor registrese</p>

                  <button
                    className="ghost "
                    id="signUp"
                    onClick={() => handleOnClick("signUp")}
                  >
                    Registrarse
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}
