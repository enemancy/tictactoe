require('dotenv').config();

// express
const express = require('express');
const app = express();
const PORT = 3000;

//mysql
const mysql = require('mysql');
const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:process.env.MYSQL_PASSWORD,
    database:'tictactoe'
})

// ミドルウェア
app.use(express.static('public'));

// rooting
app.get('/',(req,res)=>{
    res.render('index.ejs');
});

app.get('/game',(req,res)=>{
    res.render('game.ejs');
});

app.get('/user',(req,res)=>{
    connection.query(
        'select * from users',
        (error,results) =>{
            res.render('user.ejs',{users:results});
        }
    );
});

// surver
app.listen(PORT,()=>{
    console.log(`loading on port ${PORT}`);
});