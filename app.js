require('dotenv').config();

// express
const express = require('express');
const app = express();
const PORT = 3000;
client.on('error',(error)=>console.log(err.message));

// //mysql
// const mysql = require('mysql');
// const connection = mysql.createConnection({
//     host:process.env.MYSQL_HOST,
//     user:process.env.MYSQL_USER,
//     password:process.env.MYSQL_PASSWORD,
//     database:process.env.MYSQL_DATABASE
// })
// connection.connect((err)=>{
//     if(err){
//         return console.error('MYSQL conncection error:' + err.message);
//     }
//     console.log('Connected to the MySQL server.');
// });


// pg
const {Pool} = require('pg');
const itemsPool = new Pool({
    connectionString:process.env.PG_LINK,
    ssl:{rejectUnauthorized:false}
});
itemsPool.connect((err)=>{
    if(err){
        return console.error('PostgreSQL connection error:' + err.message);
    }
    console.log('Connected to the PostgreSQL server.');
});

//フォームの値を受け取る
app.use(express.urlencoded({extended:false}));

// ミドルウェア
app.use(express.static('public'));

app.post('/',(req)=>{
    console.log(req.body.usename);
    let name = req.body.usename;
    res.send(name);
});

// rooting
app.get('/',(req,res)=>{
    res.render('index.ejs');
});

app.get('/game',(req,res)=>{
    res.render('game.ejs');
});


app.post('/game/1',(req,res)=>{
    const query ={
        text:"select * from users where name in ($1)",
        values:[req.body.player1]
    };
    itemsPool
        .query(query)
        .then((results)=>{
            results.rows.push({name:'com',color:'pink'});
            console.log(results.rows);
            res.render('game.ejs',{players:results.rows});
        })
        .catch((e)=>console.error(e.stack));
});


// 解決：先に追加された人が先行になっちゃう
// 同じ名前だとバグる→バグらなくなったけどバリデーション？したほうがいいかも
app.post('/game/2',(req,res)=>{
    const query1 = {
        text:'select * from users where name in ($1)',
        values:[req.body.player1]
    };
    let resPlayers;
    itemsPool
        .query(query1)
        .then((results)=>{
            resPlayers = results.rows;
        })
        .catch((e)=>console.error(e.stack));
    
    const query2 = {
        text:'select * from users where name in ($1)',
        values:[req.body.player2]
    };
    itemsPool
        .query(query2)
        .then((results)=>{
            if(resPlayers[0].color == results.rows[0].color){
                results.rows[0].color = 'pink';
            }
            resPlayers.push(results.rows[0]);
            res.render('game.ejs',{players:resPlayers});
        })
        .catch((e)=>console.error(e.stack));
});

app.get('/user',(req,res)=>{
    const query = {
        text:"select * from users",
    }
    itemsPool
        .query(query)
        .then((results)=>{
            console.log(res.rows);
            res.render('user.ejs',{users:results.rows});
        })
        .catch((e)=>console.error(e.stack));
});

app.post('/selectuser/:id',(req,res)=>{
    const query = {
        text:"select * from users",
    };
    itemsPool
        .query(query)
        .then((results)=>{
            res.render('selectuser.ejs',{
                users:results.rows,
                playerCnt:req.params.id
            });
        })
        .catch((e)=>console.error(e.stack));
});

app.get('/user/adduser',(req,res)=>{
    const query = {
        text:"select color from colors",
    };
    itemsPool
        .query(query)
        .then((results)=>{
            res.render('adduser.ejs',{colors:results.rows});
        })
        .catch((e)=>console.error(e.stack));
});

app.post('/adduser',(req,res)=>{
    const query = {
        text:'insert into users(name,color) values($1,$2)',
        values:[req.body.userName,req.body.userColor]
    };
    itemsPool
        .query(query)
        .then((results)=>{
            res.redirect('/user');
        })
        .catch((e)=>console.error(e.stack));
});

app.post('/deleteuser/:id',(req,res)=>{
    const query = {
        text:'delete from users where id=$1',
        values:[req.params.id]
    };
    itemsPool
        .query(query)
        .then((results)=>{
            res.redirect('/user');
        })
        .catch((e)=>console.error(e.stack));
})

// const testQuery = 
//     'select name,color from users where name = ?'

// app.post('/testcode',(res,req)=>{
//     connection.query(
//         testQuery,
//         ['yyy'],
//         (error,results)=>{
//             const tmp = results;
//             tmp.push({id:100,name:'com',color:'pink'});
//             console.log(tmp);
//         }
//     )
// })

// surver
app.listen(PORT,()=>{
    console.log(`loading on port ${PORT}`);
});