import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
    const [username, setUsername] = useState(''); // New state for username
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('Form submitted with:', { username, email, password });

        if (!username) {
            setErrorMessage('Please enter a username');
            console.log('Username is empty');
            return;
        }

        if (!validateEmail(email)) {
            setErrorMessage('Please enter a valid email address');
            console.log('Invalid email:', email);
            return;
        }

        if (!password) {
            setErrorMessage('Please enter a password');
            console.log('Password is empty');
            return;
        }

        
        try {
            const response = await fetch('https://nbareels-backend.onrender.com/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });
            

            console.log('Signup response received:', response);

            // Log response status and text before parsing JSON
            const responseText = await response.text();
            console.log('Raw response text:', responseText);

            const data = JSON.parse(responseText);
            console.log('Parsed response data:', data);

            if (response.ok) {
                console.log('Registration successful');
                // Handle successful registration (e.g., redirect to login or home page)
            } else {
                console.log('Registration failed:', data.message);
                setErrorMessage(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Error during signup:', error);
            setErrorMessage('Server error');
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-box">
                <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username"><strong>Username</strong></label>
                        <input
                            type="text"
                            placeholder="Enter Username"
                            name="username"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                setErrorMessage('');
                            }}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email"><strong>Email</strong></label>
                        <input
                            type="text"
                            placeholder="Enter Email"
                            name="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setErrorMessage('');
                            }}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password"><strong>Password</strong></label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            name="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setErrorMessage('');
                            }}
                            className="form-control"
                        />
                    </div>
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    <button type="submit" className="btn btn-primary">Register</button>
                </form>
                <p>Already have an account?</p>
                <Link to="/login" className="btn btn-secondary">Login</Link>
            </div>
        </div>
    );
};

export default Signup;
