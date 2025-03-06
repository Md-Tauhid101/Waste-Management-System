import React, { useState } from "react";
import "../style/Signup.css"
import { Link, useNavigate } from "react-router-dom";
import Validation from "./signupValidation";
import axios from "axios";

function SignUp() {
    const navigate = useNavigate()
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: ''
    })

    const [errors, setErrors] = useState({})

    function handleInput(event) {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    }

    function handleSubmit(event) {

        event.preventDefault();
        const validationErrors = Validation(values);
        setErrors(validationErrors);

        if (!validationErrors.name && !validationErrors.email && !validationErrors.password) {
            axios.post("http://localhost:3000/SignUp", values)
                .then(res => {
                    navigate("/Home");
                })
                .catch(err => console.log(err));
        }
    }




    return (
        <div className="container">
            <div className="heading">
                <h1>Waste Management System</h1>
            </div>
            <div className="sub-container">
                <h3 className="signup-request">Sign Up</h3>
                <div className="signup-form-class">
                    <form onSubmit={handleSubmit} action="">
                        <div className="signup-input-text">
                            <label htmlFor="name">Name</label>
                            <input
                                onChange={handleInput}
                                type="text"
                                placeholder="Enter Name"
                                autoComplete="off"
                                name="name"
                            />
                            {errors.name && <span className="validation-condition">{errors.name}</span>}
                        </div>
                        <div className="signup-input-text">
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
                        <div className="signup-input-text">
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
                        <div className="signup-buttons">
                            <button type="submit">SignUp</button>
                            <div className="signup-class">
                                <p>Already have an account?</p>
                                <Link to="/Login" id="signup-button">Log in</Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUp;