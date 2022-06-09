const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");
const cors = require("cors");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.use(cors({
    origin: ["http://127.0.0.1:5500"],
}));

// creating connection to database
const pool = mysql.createPool({
    host: '127.0.0.1',
    port: 3306,
    user: 'Gufran',
    password: "ihateinshan",
    database: 'foodvlogz'
});
pool.getConnection(function (err, connection) {
    if (err) {
        connection.release();
        throw err;
    }
    console.log("mySql Connected")
})
// for signup
app.post('/register', async (req, res) => {
     console.log("req body data",req.body)
    
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.send({ error: "Please fill Form Correctly" });
        return;
    }

    const [user] = await pool.query(`SELECT email,password FROM users WHERE email="${email}"`);
    console.log(user)
    if (user&&user.length>0) {
        console.log("1")
        res.send({ error: "This email is already taken" });
        return;
    }else{
        console.log("2")
        const [rows] = await pool.query("INSERT INTO users (name, email,password) VALUES (?,?,?)", [name, email, password]);
        res.send({ success: "registered" });
    }
    
});

// for login
app.post('/login', async (req, res) => {
    // console.log(req.body);
    const { email, password } = req.body;
    // console.log("I AM HERE");

    if ( !email || !password) {
        res.send({ error: "Please fill Form Correctly" })
        return;
    }
    const [rows] = await pool.query(`SELECT email,password FROM users WHERE email="${email}"`);
    // console.log(rows);
    if (rows&&rows.length===0) {
        console.log("2");
        res.send({ error: "username or password incorrect" })
        return;
    }
    // console.log("email",email);
    // console.log("rows.email",rows[0].email)
    // console.log("true or false",email===rows[0].email)
    if (rows&&(email === rows[0].email)) {
        console.log("3");
        if (password === rows[0].password) {
            console.log("4");
           
            res.send({ success: "login user" })
            return;
        } else {
            console.log("5");
            res.send({ error: "username or password incorrect" });
            return;
        }
    }
    if (email == !rows[0].email) {
        res.send({ error: "username or password incorrect" })
        return;
    }
});



app.listen(3000, function () {
    console.log("server is running at port 3000");
});