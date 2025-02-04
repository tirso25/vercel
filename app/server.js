const express = require("express");//Para poder utilizar express
const db = require("./db");//Carga el archivo db.js para la conexión con la bd y poder comunicarnos con la bd
require("dotenv").config();//Carga las variables del archivo .env(DATABASE_URL/PORT)
const app = express();//Creamos una variable para poder utilizar las funciones de express
const PORT = process.env.PORT || 3000;//Cojemos el puerto del archivo .env o lo definimos nosotros
const path = require("path");
const bcrypt = require('bcryptjs');
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


app.post("/", (req, res) => {
    es.sendFile(path.join(__dirname, "../public/index.html"));
})

app.get("/signin", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/signIn.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/login.html"));
});

app.post("/users/signin", async (req, res) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    const querySelect = "SELECT * FROM users WHERE email = $1 OR username = $2";
    try {
        const result = await db.query(querySelect, [email, username]);
        if (result.rows.length > 0) {
            return res.status(400).json({ mensaje: "Email o usuario ya registrado" });
        }

        const queryInsert = "INSERT INTO users (email, username, password) VALUES ($1, $2, $3)";
        let passwordHash = await bcrypt.hash(password, 8)
        try {
            await db.query(queryInsert, [email, username, passwordHash]);
            return res.status(201).json({ mensaje: "Usuario guardado correctamente" });
        } catch (err) {
            return res.status(500).json({
                mensaje: "Error del servidor",
            });
        }
    } catch (err) {
        return res.status(500).json({
            mensaje: "Error del servidor",
        });
    }
});

app.post("/users/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    const querySelectUname = "SELECT * FROM users WHERE email = $1";

    try {
        const resultSelectUname = await db.query(querySelectUname, [email]);

        if (resultSelectUname.rows.length === 0) {
            return res.status(400).json({ mensaje: "Usuario o contraseña incorrecta" });
        }

        const userPw = resultSelectUname.rows[0].password;

        let comparePW = bcrypt.compareSync(password, userPw);

        if (!comparePW) {
            return res.status(400).json({ mensaje: "Usuario o contraseña incorrecta" });
        }

        return res.status(200).json({ mensaje: "Inicio de sesión exitoso" });

    } catch (err) {
        return res.status(500).json({
            mensaje: "Error del servidor",
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
