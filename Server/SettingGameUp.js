const { Socket } = require("socket.io")



exports.startGame = function (players, io, socket) {
    distributingCards(players, io, socket);
    
    
    
    
    
   
    //MAKING CARDS AND SHUFFLING THEM THEN SENDING THEM TO THE RESPECTED PLAYERS
    
    function distributingCards(players, io, socket) {
        let Tcards = []



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
                title: mapToCards(count - 11),
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
        io.to(players[0].id).emit('yourCards', shuffled.slice(0, 13),true);
        io.to(players[1].id).emit('yourCards', shuffled.slice(13, 26),false);
        io.to(players[2].id).emit('yourCards', shuffled.slice(26, 39),false);
        io.to(players[3].id).emit('yourCards', shuffled.slice(39, 52),false);

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
    }

}