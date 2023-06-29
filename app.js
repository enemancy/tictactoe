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

//フォームの値を受け取る
app.use(express.urlencoded({extended:false}));

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

app.get('/user/adduser',(req,res)=>{
    res.render('adduser.ejs');
});

app.post('/adduser',(req,res)=>{
    connection.query(
        'insert into users(name,color) values(?,?)',
        [req.body.userName,req.body.userColor],
        (error,results)=>{
            res.redirect('/user');

            // 以下コードにするとリロードでinsertされる
            // connection.query(
            //     'select * from users',
            //     (error,results) =>{
            //         res.render('user.ejs',{users:results});
            //     }
            // );
        }
    );
});

app.post('/deleteuser/:id',(req,res)=>{
    connection.query(
        'delete from users where id=?',
        [req.params.id],
        (error,results)=>{
            res.redirect('/user');
        }
    )
})

// surver
app.listen(PORT,()=>{
    console.log(`loading on port ${PORT}`);
});