import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();

    console.log('Navbar is rendering');  // Debugging log
    
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
                <span className="navbar-item" onClick={() => navigate('/login')}>Login</span>
                <span className="navbar-item" onClick={() => navigate('/signup')}>Signup</span>
            </div>
        </nav>
    );
};

export default Navbar;



