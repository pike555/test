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

io.sockets.on('connection', function (socket) {

	// when the client emits 'adduser', this listens and executes
	socket.on('joinroom', function(username,room){
    //console.log(username+"||"+room);
		// store the username in the socket session for this client
		socket.username = username;
		// store the room name in the socket session for this client
		socket.room = room;
		// add the client's username to the global list
		usernames[username] = username;
		// send client to room 1
		//socket.join(room);
		// echo to client they've connected
		socket.emit('updatechat', 'SERVER', 'you have connected to '+room);
		// echo to room 1 that a person has connected to their room
		socket.broadcast.to(room).emit('updatechat', 'SERVER', username + ' has connected to this room');
		//socket.emit('updaterooms', rooms, room);

	});

	// when the client emits 'sendchat', this listens and executes
	socket.on('sendchat', function (data) {
		// we tell the client to execute 'updatechat' with 2 parameters
		io.sockets.in(socket.room).emit('updatechat', socket.username, data);
    //console.log(socket.room+'-'+socket.username+'-'+data);
	});

  socket.on('masterNumber',function(data){
    //io.socket.emit('cardNumber',data);
    //console.log(data);
    socket.in(socket.room).emit('masterNumber',data);
  });

	// when the user disconnects.. perform this
	socket.on('disconnect', function(){
		// remove the username from global usernames list
		delete usernames[socket.username];
		// update list of users in chat, client-side
		io.sockets.emit('updateusers', usernames);
		// echo globally that this client has left
		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
		socket.leave(socket.room);
	});
});
console.log("running :80");
