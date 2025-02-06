const pool = require("./db");//Carga el archivo db.js para la conexión con la bd y poder comunicarnos con la bd

/**
 * Constante para crear la tabla de usuarios
 */
const createTables = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(150) UNIQUE NOT NULL,
                username VARCHAR(100) NOT NULL,
                password TEXT NOT NULL
            );
        `);
        console.log("✅ Tabla 'users' creada o ya existía.");
    } catch (err) {
        console.error("❌ Error creando la tabla:", err);
    }
};
createTables();
