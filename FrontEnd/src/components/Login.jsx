import React, { useState } from "react";
import Validation from "./loginValidation";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";  // Import useNavigate
import "../style/Login.css"

function Login() {
    const [values, setValues] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();  // Initialize navigate

    function handleInput(event) {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));  // Remove extra square brackets
    }

    function handleSubmit(event) {
        event.preventDefault();
        const validationErrors = Validation(values);
        setErrors(validationErrors);

        if (!validationErrors.email && !validationErrors.password) {
            axios.post("http://localhost:3000/login", values)  // Update URL to /login
                .then(res => {
                    alert(res.data.message); // Optional: alert for successful login
                    navigate("/Home");  // Redirect to home or desired page
                })
                .catch(err => {
                    if (err.response) {
                        alert(err.response.data.message); // Show alert with error message
                    } else {
                        console.error("Error Message:", err.message);
                    }
                });
        }
    }

    return (
        <div className="container">
            <div className="heading">
                <h1>Waste Management System</h1>
            </div>
            <div className="sub-container">
                <h3 className="login-request">Please Login</h3>
                <div className="form-class">
                    <form onSubmit={handleSubmit} action="">
                        <div className="input-text">
                            <label htmlFor="email">Email</label>
                            <input
                                onChange={handleInput}
                                type="text"
                                placeholder="Email"
                                autoComplete="off"
                                name="email"
                            />
                            {errors.email && <span className="validation-condition">{errors.email}</span>}
                        </div>
                        <div className="input-text">
                            <label htmlFor="password">Password</label>
                            <input
                                onChange={handleInput}
                                type="password"
                                placeholder="Password"
                                autoComplete="off"
                                name="password"
                            />
                            {errors.password && <span className="validation-condition">{errors.password}</span>}
                        </div>
                        <div className="buttons">
                            <button type="submit">Login</button>
                            <div className="signup-class">
                                <p>Don't have account?</p>
                                <Link to="/SignUp" id="signup-button">Sign Up</Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
