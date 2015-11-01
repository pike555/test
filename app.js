var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server)
  ,mysql = require('mysql')
  ,connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test-bingo',
    port: 3306
  })
  ,POLLING_INTERVAL = 0
  ,pollingTimer;

connection.connect(function(err) {
  // connected! (unless `err` is set)
  if (err) {
    console.log(err);
  }
});

server.listen(8081);

app.use(express.static('public'));

// routing
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/views/user-ui.html');
});
app.get('/user', function (req, res) {
  res.sendfile(__dirname + '/views/user-ui.html');
});
app.get('/bingo/:id',function(req,res){
  //res.sent(res.params.id);
  res.sendfile(__dirname + '/views/user-ui.html');
});
app.get('/bingo/vj/:id',function(req,res){
  //res.sent(res.params.id);
  res.sendfile(__dirname + '/views/vj-ui.html');
});

// usernames which are currently connected to the chat
var usernames = {};
var userlastdata = {};
io.sockets.on('connection', function (socket) {
	socket.on('joinroom', function(username,room){
    if(room != undefined){
      var datas = [];
      var query = connection.query('SELECT * FROM user_last where user_name = ?',[username]);
      query.on('error',function(err){
        console.log(err);
      }).on('result',function(data){
        datas.push(data);
        //console.log(datas);
      }).on('end',function(){
        //console.log(datas);
        socket.emit('userreturn', datas);
        //socket.emit('updatechat', 'test', 'user return');
      });
    }
	});

  socket.on('adduser', function(username,room){
    console.log(username+"||"+room+"|"+socket.room);
		socket.username = username;
		socket.room = room;
		usernames[username] = username;
		socket.join(room);
		socket.emit('updatechat', 'SERVER', 'you have connected to '+room);
		socket.broadcast.to(room).emit('updatechat', 'SERVER', username + ' has connected to this room');

    if(room != undefined){
      //send status room to user
      var datas = [];
      var query = connection.query('SELECT * FROM game_detail where room_id = '+room);
      query.on('error',function(err){
        console.log(err);
      }).on('result',function(data){
        //console.log(data);
        datas.push(data);
      }).on('end',function(){
        //console.log(datas);
        socket.emit('gameselect', datas[0].game_id);
        socket.emit('gamestatus', datas[0].game_status,datas[0].game_no);
        socket.emit('gamecontrol', datas[0].game_data);
      });
    }
  });

  socket.on('createroom',function(username,room){
    if(room != undefined){
      //insert room to database
      var query2 = connection.query('INSERT INTO `game_detail` (`room_id`) VALUES ('+room+') ON DUPLICATE KEY UPDATE room_id = room_id');
      query2.on('error',function(err){
        console.log(err);
      });

      var datas = [];
      var query = connection.query('SELECT * FROM game');
      query.on('error',function(err){
        console.log(err);
      }).on('result',function(data){
        datas.push(data);
      }).on('end',function(){
        //console.log(datas);
        socket.emit('allgames', datas);
      });
    }
  });

  // when the client emits 'sendchat', this listens and executes
  socket.on('sendchat', function (data) {
    // we tell the client to execute 'updatechat' with 2 parameters
    //console.log(socket.room+'-'+socket.username+'-'+data);
    io.sockets.in(socket.room).emit('updatechat', socket.username, data);
  });

  socket.on('gameselect',function(data){
    socket.broadcast.to(socket.room).emit('gameselect',data);
    var query = connection.query('UPDATE `game_detail` SET `game_id`=? WHERE (`room_id`=?)',[data,socket.room]);
    query.on('error',function(err){
      console.log(err);
    });
  });

  /*socket.broadcast.on('gamestatus',function(status,gameno){
    socket.broadcast.to(socket.room).emit('gamestatus',status,gameno);
    //console.log(gameno);
    var query = connection.query('UPDATE `game_detail` SET `game_status`=?, game_no =? WHERE (`room_id`=?)',[status,gameno,socket.room]);
    query.on('error',function(err){
      console.log(err);
    });
  });*/

  socket.on('gamecontrol',function(data){
    //console.log(data);
    socket.in(socket.room).emit('gamecontrol',data);
    //console.log("UPDATE game_detail SET game_data ="'+data+'" WHERE (`room_id`='+socket.room+')");
    var query = connection.query('UPDATE `game_detail` SET `game_data`=? WHERE (`room_id`=?)',[data,socket.room]);
    query.on('error',function(err){
      console.log(err);
    });
  });

  /*socket.on('getlastdata',function(data){
    userlastdata[socket.username] = data;
  });*/
	// when the user disconnects.. perform this
	socket.on('disconnect', function(){
		// remove the username from global usernames list
		delete usernames[socket.username];
		// update list of users in chat, client-side
		io.sockets.emit('updateusers', usernames);
		// echo globally that this client has left
		socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username + ' has disconnected');
		socket.leave(socket.room);
	});
});
