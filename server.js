var express = require('express');
app = express();
server = require('http').createServer(app);
io = require('socket.io').listen(server);
users = [];

server.listen(7000,function(){
console.log('listening on  *:7000');
  });

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

// Socket Connection
io.sockets.on('connection', function(socket){
    socket.on('new user', function(user,circle,callback){
        if(users.indexOf(user) != -1)
        {
            callback(false);
        } else 
        {
            callback(true);
            socket.user = {user : user,circle :circle};
            users.push(socket.user);
            updateUsernames();
        }
    });

    // update usernames
    function updateUsernames(){
    //    console.log("update :" + socket.user.user + "circle :" +socket.user.circle);
        io.sockets.emit('users', users);
    }

    // Send Message
   socket.on('add user', function(data){
  // console.log("socket.user.circle" + socket.user.circle);
    // io.sockets.emit('new message', {user: socket.user.user, circle :socket.user.circle});
    io.sockets.emit('new message', 
           {user: socket.user.user, circle :socket.user.circle});
   
     });

    //Disconnect
    socket.on('disconnect', function(data){
        if(!socket.user) return;
        users.splice(users.indexOf(socket), 1);
        updateUsernames();
    });});