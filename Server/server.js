const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const game = require('./SettingGameUp');
const port = process.env.PORT || 4001;
const index = require("./routes/index");
const app = express();
app.use(index);
const server = http.createServer(app);
const io = socketIo(server);
var cards;
var users = [];
var currentcards = []
var currentUsers = [];
var nextTurn = 0;
var winner;
var temp;
var x;
io.on("connection", (socket) => {




  socket.on("Requesttojoinroom", (data) => {

    socket.join(data.sendcode)

    socket.position = io.sockets.adapter.rooms.get(data.sendcode).size;


    var identity =
    {
      user: data.name,
      showRoom: true,
      totalPlayers: io.sockets.adapter.rooms.get(data.sendcode).size,
      id: socket.id,

    };

    users.push({ name: data.name,    position: io.sockets.adapter.rooms.get(data.sendcode).size, id: socket.id, room: data.sendcode })

    currentUsers = users.map((x) => { if (x.room == data.sendcode) { return x } });


    console.log(currentUsers);


    if (currentUsers.length < 5) {
      socket.emit('Youjoined', identity, currentUsers);

      io.to(data.sendcode).emit('NewPlayerJoined', io.sockets.adapter.rooms.get(data.sendcode).size, true, currentUsers);
      if (currentUsers.length == 4) {
        game.startGame(currentUsers, io, socket);
      }
    }

    else {
      socket.leave(data.sendcode);
    }
    socket.on('cardPlayed', (card, playedBy) => {
      currentcards[playedBy - 1] = card;
      console.log(currentcards);
      if (!(currentcards.length > 3)) {
        socket.emit('cardPlayedBy', card, playedBy);
        socket.to(currentUsers[0].room).emit('cardPlayedBy', card, playedBy);

        socket.to(data.sendcode).emit('nextTurn', false);
        if (playedBy == 4) {
          nextTurn = 0
          socket.to(currentUsers[nextTurn].id).emit('yourTurn', true)
        }

        else {
          nextTurn = playedBy;
          socket.to(currentUsers[nextTurn].id).emit('yourTurn', true);
        }
      }
      else {
        socket.emit('cardPlayedBy', card, playedBy);
        socket.to(currentUsers[0].room).emit('cardPlayedBy', card, playedBy);

        socket.to(data.sendcode).emit('nextTurn', false);
        if (playedBy == 4) {
          nextTurn = 0
          socket.to(currentUsers[nextTurn].id).emit('yourTurn', true)
        }

        else {
          nextTurn = playedBy;
          socket.to(currentUsers[nextTurn].id).emit('yourTurn', true);
        }
        console.log('next turn is of ', nextTurn)
        let sameCards = currentcards.map((x) => { if (x.name === currentcards[nextTurn].name) { return x } });
        // console.log(sameCards);
        temp = -10;
        for (x of sameCards) {
          if (x) {
            
            if (x.value > temp) {
              // console.log(sameCards.indexOf(x))
              winner = currentUsers[sameCards.indexOf(x)];
              console.log(winner);
              temp = x.value;
            }
            
            
            
          }
          // console.log(temp);
        }
        nextTurn = winner.position - 1;
            socket.to(data.sendcode).emit('nextTurn', false);
            io.in(currentUsers[nextTurn].id).emit('yourTurn', true)
            currentcards=[];
      }


    })

  })



});



server.listen(port, () => console.log(`Listening on port ${port}`));