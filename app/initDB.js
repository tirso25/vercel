const pool = require("./db");//Carga el archivo db.js para la conexión con la bd y poder comunicarnos con la bd

/**
 * Constante para crear la tabla de usuarios
 */
const createTableUsers = async () => {
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
        console.error("❌ Error creando la tabla 'users':", err);
    }
};

const createTableFvSongs = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS favouriteSongs (
                id_song INT PRIMARY KEY,
                id INT,
                CONSTRAINT fk_id_user
                    FOREIGN KEY(id)
                    REFERENCES users(id)
            );
        `);
        console.log("✅ Tabla 'favouriteSongs' creada o ya existía.");
    } catch (err) {
        console.error("❌ Error creando la tabla 'favouriteSongs':", err);
    }
}

createTableUsers();
createTableFvSongs();
