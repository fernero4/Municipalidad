import React, { Component } from 'react';
import axios from 'axios';

class Registro extends Component {
    state = {
        email: '',
        password: ''
    };

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('URL_API_REGISTRO', this.state);
            console.log(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input
                    type="email"
                    name="email"
                    value={this.state.email}
                    onChange={this.handleChange}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    name="password"
                    value={this.state.password}
                    onChange={this.handleChange}
                    placeholder="Contraseña"
                    required
                />
                <button type="submit">Registrarse</button>
            </form>
        );
    }
}

export default Registro;
