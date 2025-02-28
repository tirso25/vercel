const express = require("express");//Para poder utilizar express
const db = require("./db");//Carga el archivo db.js para la conexión con la bd y poder comunicarnos con la bd
require("dotenv").config();//Carga las variables del archivo .env(DATABASE_URL/PORT)
const app = express();//Creamos una variable para poder utilizar las funciones de express
const PORT = process.env.PORT || 4000;//Cojemos el puerto del archivo .env o lo definimos nosotros
const path = require("path");
const bcrypt = require('bcryptjs');//encriptar
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
const cors = require("cors");
// Configurar CORS para permitir solicitudes desde cualquier origen
app.use(cors({
    origin: "*", // Permitir todas las solicitudes
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
    allowedHeaders: ["Content-Type", "Authorization"] // Cabeceras permitidas
}));

/**
 * Directorio raiz
 * Nos redirige al index
 */
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
})

/**
 * nos redirige al registro
 */
app.get("/signin", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/signIn.html"));
});

/**
 * nos redirige al inicio de sesion
 */
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/login.html"));
});

app.post("/ver/favs", async (req, res) => {
    const { idUser } = req.body;
    //comprobamos que no nos lleguen datos vacios
    if (!idUser) {
        return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }
    //vemos si esa canción ya se ha añadido a favorito
    const querySelectUname = "SELECT * FROM favouriteSongs WHERE id_user = $1";
    try {
        const resultSelectUname = await db.query(querySelectUname, [idUser]);
        //si se ha encontrado devolvemos un estado 400 (ervidor no pudo interpretar la solicitud dada una sintaxis inválida)
        if (resultSelectUname.rows.length > 0) {
            return res.status(200).json({ cancionesArray: resultSelectUname });
        }
    } catch (err) {
        return res.status(500).json({ mensaje: "Error del servidor" });
    }
});

app.post("/users/signin", async (req, res) => {
    try {
        const { email, username, password } = req.body;
        //comprobamos que no nos lleguen datos vacios
        if (!email || !username || !password) {
            return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
        }
        //comprobamos que no exista otro usuario con ese email o username
        const querySelect = "SELECT * FROM users WHERE email = $1 OR username = $2";
        try {
            const result = await db.query(querySelect, [email, username]);
            //si se ha encontrado devolvemos un estado 400 (ervidor no pudo interpretar la solicitud dada una sintaxis inválida)
            if (result.rows.length > 0) {
                return res.status(400).json({ mensaje: "Email o usuario ya registrado" });
            }
            //insertamos
            const queryInsert = "INSERT INTO users (email, username, password) VALUES ($1, $2, $3)";
            //encriptamos la contraseña
            let passwordHash = await bcrypt.hash(password, 8)
            try {
                await db.query(queryInsert, [email, username, passwordHash]);
                //devolvemos un 201 ya que hemos creado un nuevo registro
                return res.status(201).json({ mensaje: "Usuario guardado correctamente" });
            } catch (err) {
                return res.status(500).json({ mensaje: "Error del servidor" });
            }
        } catch (err) {
            return res.status(500).json({ mensaje: "Error del servidor" });
        }
    } catch (err) {
        return res.status(500).json({
            mensaje: "Error del servidor",
        });
    }
});

app.post("/users/favs", async (req, res) => {
    const { idSong, idUser } = req.body;
    //comprobamos que no nos lleguen datos vacios
    if (!idUser || !idSong) {
        return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }
    //vemos si esa canción ya se ha añadido a favorito
    const querySelectUname = "SELECT * FROM favouriteSongs WHERE id_song = $1 AND id_user = $2";
    try {
        const resultSelectUname = await db.query(querySelectUname, [idSong, idUser]);

        //si se ha encontrado devolvemos un estado 400 (ervidor no pudo interpretar la solicitud dada una sintaxis inválida)
        if (resultSelectUname.rows.length > 0) {
            const queryDelectUname = "DELETE FROM favouriteSongs WHERE id_song = $1 AND id_user = $2";
            await db.query(queryDelectUname, [idSong, idUser]);
            return res.status(201).json({ mensaje: "Canción eliminada de favoritos" });
        }
        //insertamos
        const queryInsert = "INSERT INTO favouriteSongs (id_song, id_user) VALUES ($1, $2)";
        try {
            await db.query(queryInsert, [idSong, idUser]);
            //devolvemos un 201 ya que hemos creado un nuevo registro
            return res.status(201).json({ mensaje: "Canción favorita insertada correctamente" });
        } catch (err) {
            return res.status(500).json({ mensaje: "Error del servidor" });
        }
    } catch (err) {
        return res.status(500).json({ mensaje: "Error del servidor" });
    }
});

app.post("/users/login", async (req, res) => {
    const { email, password } = req.body;
    //comprobamos que no nos lleguen datos vacios
    if (!email || !password) {
        return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }
    //vemos si existe ese usuario
    const querySelectUname = "SELECT * FROM users WHERE email = $1";

    try {
        const resultSelectUname = await db.query(querySelectUname, [email]);
        //si no se ha encontrado devolvemos un estado 400 (ervidor no pudo interpretar la solicitud dada una sintaxis inválida)
        if (resultSelectUname.rows.length === 0) {
            return res.status(400).json({ mensaje: "Usuario o contraseña incorrecta" });
        }

        const userPw = resultSelectUname.rows[0].password;
        const userUsername = resultSelectUname.rows[0].username;
        const idUser = resultSelectUname.rows[0].id;
        //comprobamos que las contraseña sean iguales 
        let comparePW = bcrypt.compareSync(password, userPw);

        if (!comparePW) {
            return res.status(400).json({ mensaje: "Usuario o contraseña incorrecta" });
        }

        return res.status(200).json({ mensaje: "Inicio de sesión exitoso", username: userUsername, id: idUser });

    } catch (err) {
        return res.status(500).json({ mensaje: "Error del servidor" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});