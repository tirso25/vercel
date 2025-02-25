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
                password TEXT NOT NULL,
                creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
            id_song VARCHAR(150) NOT NULL,
            id_user INT NOT NULL,
            agregado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id_song, id_user),
            CONSTRAINT fk_user FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE
        );
        `);
        console.log("✅ Tabla 'favouriteSongs' creada o ya existía.");
    } catch (err) {
        console.error("❌ Error creando la tabla 'favouriteSongs':", err);
    }
}

createTableUsers();
createTableFvSongs();