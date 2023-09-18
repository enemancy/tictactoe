require('dotenv').config();

// express
const express = require('express');
const app = express();
const PORT = 3000;

//mysql
const mysql = require('mysql');
const connection = mysql.createConnection({
    // localhostだからデプロイしたらできない？
    host:'localhost',
    user:'root',
    password:process.env.MYSQL_PASSWORD,
    database:'tictactoe'
})

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
    connection.query(
        'select * from users where name in (?)',
        [req.body.player1],
        (error,results)=>{
            results.push({name:'com',color:'pink'});
            console.log(results);
            //game.ejsにはplayersを渡せるけどgame.jsには渡せない。。。
            res.render('game.ejs',{players:results});
        }
    );
});


// 先に追加された人が先行になっちゃう
// 同じ名前だとバグる
app.post('/game/2',(req,res)=>{
    connection.query(
        'select * from users where name in (?,?)',
        [req.body.player1,req.body.player2],
        (error,results)=>{
            console.log(results);
            //game.ejsにはplayersを渡せるけどgame.jsには渡せない。。。
            if(results[0].color == results[1].color){
                results[1].color = 'pink';
            }
            res.render('game.ejs',{players:results});
        }
    );
});

app.get('/user',(req,res)=>{
    connection.query(
        'select * from users',
        (error,results) =>{
            res.render('user.ejs',{users:results});
        }
    );
});

app.post('/selectuser/:id',(req,res)=>{
    connection.query(
        'select * from users',
        (error,results)=>{
            res.render(
                'selectuser.ejs',
                {
                    users:results,
                    playerCnt:req.params.id
                }
            );
        }
    );
});

app.get('/user/adduser',(req,res)=>{
    connection.query(
        'select color from colors',
        (error,results)=>{
            res.render('adduser.ejs',{colors:results});
        }
    )
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