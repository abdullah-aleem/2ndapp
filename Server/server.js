const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const index = require("./routes/index");
const app = express();
app.use(index);
const server = http.createServer(app);
var users = [];
const io = socketIo(server);
var cards;

io.on("connection", (socket) => {
  socket.on("Requesttojoinroom", (data) => {

    // c.log(data);
    if(data.id==1){
      
      users.push(data);
      let Tcards = []
        
        //    const cards={};

        for (let count = 0; count < 13; count++) {
            Tcards[count] = {
                name: "Spades",
                title: mapToCards(count + 2),
                value: count + 2,
                class: "suit Spade"
            }

        }
        for (let count = 13; count < 26; count++) {
            Tcards[count] = {
                name: " Diamonds",
                title:  mapToCards(count - 11),
                value: count - 11,
                class: "suit diamonds"
            }

        }
        for (let count = 26; count < 39; count++) {
            Tcards[count] = {
                name: "Heart",
                title: mapToCards(count - 24),
                value: count - 24,
                class: "suit hearts"
            }

        }
        for (let count = 39; count < 52; count++) {
            Tcards[count] = {
                name: "Clubs",
                title: mapToCards(count - 37),
                value: count - 37,
                class: "suit clubs"
            }

        }



        const shuffled = Tcards.sort(() => 0.5 - Math.random());

        
        // console.log(shuffled);
        cards=shuffled;
        socket.emit("FromAPI", true,users[users.length-1],cards,1);
        
      }
       
  
       
    else{
    const index = users.map((x) => { if (x.sendcode == data.sendcode) { return x.id } });
    
    const allow = index[index.length - 1]
    
    users.push(data);
    //console.log(index);
    
    if (allow < 4) {
      
     
      users[users.length-1].id=allow+1;
      socket.emit("FromAPI", true,users[users.length-1],cards);
    }
    else {
      users.pop();
      socket.emit("FromAPI", false,users[users.length-1],cards);
      // console.log(users);
    
    }
  }

  })
  
});

function mapToCards(value) {
  switch (value) {
      case 11:
          return 'J';

      case 12:
          return 'Q';

      case 13:
          return 'K';

      case 14:
          return 'A';

      default:
          return value;

  }
}
server.listen(port, () => console.log(`Listening on port ${port}`));