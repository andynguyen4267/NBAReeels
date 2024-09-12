import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token'); // Check if the user is logged in

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove the token from localStorage
        navigate('/');
        window.location.reload(); // Redirect to the login page
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand" onClick={() => navigate('/')}>
                <span className="navbar-logo">NBAReels</span>
            </div>
            <div className="navbar-links">
                <span className="navbar-item" onClick={() => navigate('/')}>Home</span>
                <span className="navbar-item" onClick={() => navigate('/players')}>Player Highlights</span>
                <span className="navbar-item" onClick={() => navigate('/teams')}>Team Highlights</span>
            </div>
            <div className="navbar-auth">
                {token ? (
                    // Show "Sign Out" if the user is logged in
                    <span className="navbar-item" onClick={handleLogout}>Sign Out</span>
                ) : (
                    // Show "Login" and "Signup" if the user is not logged in
                    <>
                        <span className="navbar-item" onClick={() => navigate('/login')}>Login</span>
                        <span className="navbar-item" onClick={() => navigate('/signup')}>Signup</span>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;


