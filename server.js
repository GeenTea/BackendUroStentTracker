const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const session = require('express-session');

app.use(express.json());
app.use(cors(
    {
        origin: "http://localhost:5173", // Замените на ваш фронтенд адрес
        credentials: true,
    }
));

const db = mysql.createConnection({
    host: '127.0.0.1', // Убрали порт отсюда
    port: 3306,        // Добавили порт отдельно
    user: 'root',
    password: 'TheHystoryofArthurMorgan1889',
    database: 'urostenttracker',
});

// Проверка подключения к БД
db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});

app.use(session({
    secret: process.env.JWT_SECRET || 'skibidi', // Замените на ваш секретный ключ
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 день
        secure: false,
        sameSite: 'lax'
    }
}));

app.get('/', (req, res) => {
    return res.json("From backend")
})

app.post('/login', (req, res) => {
    const { username, password } = req.body; // Изменили req.query на req.body
    const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;

    db.query(sql, [username, password], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: "Internal server error" });
        }
        if (result.length > 0) {
            let usernameSession =req.session.user = result[0];
            console.log(usernameSession);
            return res.json({
                status: "success",
                message: "Login successful",
                user: result[0]
            });
        } else {
            return res.status(401).json({
                status: "error",
                message: "Invalid credentials"
            });
        }
    });
});

app.post('/main-menu', (req, res) =>{
    if (req.session.user) {
        return res.json({
            status: "success",
            message: "User is logged in",
            user: req.session.user
        });
    } else {
        return res.status(401).json({
            status: "error",
            message: "User is not logged in"
        });
    }
})

app.post('/logout', (req,res) => {
    if (req.session.user) {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({
                    status: "error",
                    message: "Logout failed"
                });
            }
            return res.json({
                status: "success",
                message: "Logout successful"
            });
        });
    } else {
        return res.status(401).json({
            status: "error",
            message: "User is not logged in"
        });
    }
})

app.post('/add-patient', (req, res) => {
    const { number, fname, lname, consultant_name, stent_insertion_date, scheduled_removal_date } = req.body;


    const sql = `INSERT INTO patient (hospital_number, fname, lname, consultant_name, stent_insertion_date, scheduled_removal_date) VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(sql, [number, fname, lname, consultant_name, stent_insertion_date, scheduled_removal_date], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: "Internal server error" });
        }
        return res.json({
            status: "success",
            message: "Patient added successfully"
        });
    });
});
app.listen(3000, () => {
    console.log("Server is running on port localhost:3000");
});
