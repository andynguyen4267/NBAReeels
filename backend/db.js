const { Pool } = require('pg');
require('dotenv').config(); // Load environment variables from .env file

// Create a new pool instance
const pool = new Pool({
    connectionString: "postgres://andynguyen:UCI.PEnguinman24.@localhost:5432/nbareels" // Use the DATABASE_URL from the .env file
});

module.exports = pool; // Export the pool for use in other files
