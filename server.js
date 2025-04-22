const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const session = require('express-session');

app.use(express.json());
app.use(cors(
    {
        origin: "http://localhost:5173", // Replace with your frontend address
        credentials: true,
    }
));

const db = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'yourpassword', /*add your database password*/
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
    secret: process.env.JWT_SECRET || 'skibidi', // Replace with your secret key
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
    const { username, password } = req.body;
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
app.get('/patient', (req, res) => {
    const sql = 'SELECT * FROM patient';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: "Internal server error" });
        }
        // Убедитесь, что возвращаем массив
        return res.json(Array.isArray(result) ? result : [result]);
    });
});

app.post('/edit-patient/:patient_id', (req, res) => {
    const id = req.params.patient_id; // Not req.params.id
    const sql =
        "UPDATE patient SET hospital_number = ?, fname = ?, lname = ?, consultant_name = ?, stent_insertion_date = ?, scheduled_removal_date = ? WHERE patient_id = ?";
    const { hospital_number, fname, lname, consultant_name, stent_insertion_date, scheduled_removal_date } = req.body;
    db.query(sql, [hospital_number, fname, lname, consultant_name, stent_insertion_date, scheduled_removal_date, id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: "Internal server error" });
        }
        return res.json({
            status: "success",
            message: "Patient updated successfully"
        });
    });
})
app.delete('/delete-patient/:patient_id', (req, res) => {
    const patient_id = req.params.patient_id;
    const sql = "DELETE FROM patient WHERE patient_id = ?";
    db.query(sql, [patient_id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: "Internal server error" });
        }
        return res.json({
            status: "success",
            message: "Patient deleted successfully"
        });
    });
});

app.use((req, res) => {
    res.status(404).send('404 Not Found');
})
app.listen(3000, () => {
    console.log("Server is running on port localhost:3000");
});
