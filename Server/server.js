const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const game = require('./SettingGameUp');
const port = process.env.PORT || 4001;
const index = require("./routes/index");
const { isNullOrUndefined } = require("util");
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
var rang;
var noRangCard = true;
var sameCards;
var setRound = 1;
var round = 1;
var roundWonByPlayer1 = 0;
var roundWonByPlayer2 = 0;
var roundWonByPlayer3 = 0;
var roundWonByPlayer4 = 0;
var previuousRoundWinner = null;
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

    users.push({ name: data.name, position: io.sockets.adapter.rooms.get(data.sendcode).size, id: socket.id, room: data.sendcode })

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

    socket.on('RangSelected', rangs => {
      rang = rangs;
      console.log(rang)
      socket.emit('RangDone', true)
    })
    socket.on('cardPlayed', (card, playedBy) => {
      currentcards[playedBy - 1] = card;
      console.log('length of cards ', currentcards.length);
      console.log('index of undefined', currentcards.indexOf(undefined))
      if (!(currentcards.length > 3) || !currentcards[0] || !currentcards[1] || !currentcards[2]) {
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

        let rangCards = currentcards.map((x) => { if (x.name === rang) { return x } });
        
        for (x of rangCards) {
          console.log(x);
          if (x) {
            noRangCard = false
            sameCards = rangCards
        console.log(sameCards)
          }

        }
        if (noRangCard) {
          sameCards = currentcards.map((x) => { if (x.name === currentcards[nextTurn].name) { return x } });
          console.log('sameCards', sameCards);

        }
        noRangCard = true;
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
        if (round == 2 && previuousRoundWinner == winner) {
          console.log('in here 147')
          
          round++;
          setRound++;
        }

        else if (previuousRoundWinner == winner) {
          console.log('in here 152')
          round++;
          switch (winner.position) {
            case 1:
              roundWonByPlayer1 = setRound;
              previuousRoundWinner = null;
              setRound = 0;
              break;
            case 2:
              roundWonByPlayer2 = setRound;
              previuousRoundWinner = null;
              setRound = 0;
              break;
            case 3:
              roundWonByPlayer3 = setRound;
              previuousRoundWinner = null;
              setRound = 0;
              break;
            case 4:
              roundWonByPlayer4 = setRound;
              previuousRoundWinner = null;
              setRound = 0;
              break;
            default:
              break;
          }

        }
        else if (!previuousRoundWinner) {
          console.log('in here 184')
          previuousRoundWinner = winner;
          round++;
          setRound++;
        }
        else if (previuousRoundWinner != winner && round == 12) {
          console.log('in here 190')
          previuousRoundWinner = null;
          round++;
          setRound++;
          switch (winner.positon) {
            case 1:
              roundWonByPlayer1 = setRound;
              previuousRoundWinner = null;
              setRound = 0;
              break;
            case 2:
              roundWonByPlayer2 = setRound;
              previuousRoundWinner = null;
              setRound = 0;
              break;
            case 3:
              roundWonByPlayer3 = setRound;
              previuousRoundWinner = null;
              setRound = 0;
              break;
            case 4:
              roundWonByPlayer4 = setRound;
              previuousRoundWinner = null;
              setRound = 0;
              break;
            default:
              break;
          }
        }
        else if (previuousRoundWinner != winner) {
          console.log('in here 220')
          previuousRoundWinner == winner;
          round++;
          setRound++;
        }
        socket.to(data.sendcode).emit('nextTurn', false);
        io.in(currentUsers[nextTurn].id).emit('yourTurn', true)
        currentcards = [];
        console.log('round won by player 1', roundWonByPlayer1);
        console.log('round won by player 2', roundWonByPlayer2);
        console.log('round won by player 3', roundWonByPlayer3);
        console.log('round won by player 4', roundWonByPlayer4);
        console.log('round is now', round);
        console.log('prevous round was won by',previuousRoundWinner);

      }


    })

  })



});



server.listen(port, () => console.log(`Listening on port ${port}`));