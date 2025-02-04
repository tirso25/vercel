//PARA LA CONEXIÓN CON LA BD
const { Pool } = require("pg");
require("dotenv").config();//Carga las variables del archivo .env(DATABASE_URL/PORT)

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // Necesario para conexiones seguras en NeonDB
    },
});

pool.connect()
    .then(() => console.log("✅ Conectado a PostgreSQL"))
    .catch(err => console.error("❌ Error de conexión:", err));

module.exports = pool;
