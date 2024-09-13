const { Pool } = require('pg');
require('dotenv').config(); // Load environment variables from .env file

// "postgres://andynguyen:UCI.PEnguinman24.@localhost:5432/nbareels"
// Create a new pool instance
const pool = new Pool({
    connectionString: "postgresql://nbareels_psql_user:FuEe0aBSMJ9842o7cquQIMaPiPMMnM45@dpg-cri5t0rv2p9s73bkvoh0-a/nbareels_psql" // Use the DATABASE_URL from the .env file
});

module.exports = pool; // Export the pool for use in other files
