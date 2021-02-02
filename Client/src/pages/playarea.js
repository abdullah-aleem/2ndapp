import React, { Component } from 'react';
import { GlobalCounterProvider } from '../helpers/globalvar'
import Counter from '../helpers/Counter';
import { auth } from '../services/firebase';
import '../style.css';
import { Switch } from 'react-router-dom';
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:4001";
var connectionOptions = {
    "force new connection": true,
    "reconnectionAttempts": "Infinity", //avoid having user reconnect manually in order to prevent dead clients after a server restart
    "timeout": 10000,                  //before connect_error and connect_timeout are emitted.
    "transports": ["websocket"]
};
const socket = socketIOClient(ENDPOINT, connectionOptions);
export default class Playarea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activePlayer: null,
            active1: null,
            active2: null,
            active3: null,
            active4: null,
            error: null,
            user: auth().currentUser,
            myCards: [{}],
            allUsers: [{}],
            joincode: null,
            showRoom: null,
            identity: {},
            players: null,
            turn:false

        };

        this.CreateRoom = this.CreateRoom.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.displayPlayedCards = this.displayPlayedCards.bind(this);

    }



    playCard(card) {
        if (this.state.turn){
        socket.emit('cardPlayed', card, this.state.activePlayer);
        let temCards = this.state.myCards;
        temCards.splice(temCards.indexOf(card), 1)
        this.setState({ myCards: temCards,turn:false });
        }
        else{return;}
    }



    async CreateRoom() {
        const randomcode = Math.floor(Math.random() * 100000) + 1;
        await this.setState({
            code: randomcode,
            identity: { name: this.state.user.email, sendcode: randomcode, id: null },

        }

        );
        socket.emit("Requesttojoinroom", this.state.identity);
        socket.on('Youjoined', (identity, users) => {
            console.log(users);
            this.setState({
                players: identity.totalPlayers,
                showRoom: identity.showRoom,
                allUsers: users,
                identity: { user: identity.name, sendcode: identity.sendcode, id: identity.id },
                activePlayer: identity.totalPlayers,

            });

        }


        )
        socket.on('NewPlayerJoined', (player, showRoom, newPlayer) => {
            console.log(newPlayer);

            this.setState({
                players: player,
                showRoom: showRoom,
                // identity: info,
                allUsers: newPlayer,

            });
            console.log(player);
        }
        )
        socket.on('yourCards', (cards,turn) => {
            console.log(cards);
            this.setState({ myCards: cards, turn:turn })
        })
        socket.on('cardPlayedBy', (card, position) => {

            this.displayPlayedCards(card, position);
        })
        socket.on('nextTurn',turn=>{this.setState({turn:turn})})
        socket.on('yourTurn',turn=>{
            console.log("your turn function")
            
            this.setState({turn:turn})})
    


    }
    displayPlayedCards(card, by) {
        switch (by) {
            case 1:
                this.setState({
                    active1: <div class="card" >
                        <div class="value" card-value={card.value}>{card.title}
                        </div>
                        <div className={card.class}>
                        </div>
                    </div>
                })
                break;

            case 2:
                this.setState({
                    active2: <div class="card" >
                        <div class="value" card-value={card.value}>{card.title}
                        </div>
                        <div className={card.class}>
                        </div>
                    </div>
                })
                break;

            case 3:
                this.setState({
                    active3: <div class="card" >
                        <div class="value" card-value={card.value}>{card.title}
                        </div>
                        <div className={card.class}>
                        </div>
                    </div>
                })
                break;

            case 4:
                this.setState({
                    active4: <div class="card" >
                        <div class="value" card-value={card.value}>{card.title}
                        </div>
                        <div className={card.class}>
                        </div>
                    </div>
                })
                break;

            default:
                break;
        }
    }
    handleChange(event) {
        this.setState({
            joincode: parseInt(event.target.value),
        })
    }
    async handleSubmit(event) {
        event.preventDefault();
        if (!this.state.joincode) { }
        else {
            await this.setState({ identity: { name: this.state.user.email, sendcode: this.state.joincode, id: null } })
            //connect with server and send him the code to the room the server will check the people in the room and then rply according
            socket.emit("Requesttojoinroom", this.state.identity)
            socket.on('Youjoined', (identity, users) => {
                console.log(users);
                this.setState({
                    players: identity.totalPlayers,
                    showRoom: identity.showRoom,
                    allUsers: users,
                    identity: { user: identity.name, sendcode: identity.sendcode, id: identity.id },
                    activePlayer: identity.totalPlayers,


                });
            }
            )
            socket.on('NewPlayerJoined', (player, showRoom, newPlayer) => {
                console.log(newPlayer);


                this.setState({

                    players: player,
                    allUsers: newPlayer,
                    showRoom: showRoom,
                    // identity: info,


                });
                console.log(player);
                console.log(showRoom);
            }
            )
            socket.on('yourCards', (cards,turn) => {
                console.log(cards);
                this.setState({ myCards: cards,turn:turn })
            })

            socket.on('cardPlayedBy', (card, position) => {
                this.displayPlayedCards(card, position);

            })
            socket.on('nextTurn',turn=>{
                console.log("next turn function")
                this.setState({turn:turn})})
            socket.on('yourTurn',turn=>{
                console.log("your turn function")
                
                this.setState({turn:turn})})
        }

    }

    render() {

        const showCards = this.state.myCards.map((card) =>

            <div class="card" onClick={() => { this.playCard(card) }}>
                <div class="value" card-value={card.value}>{card.title}
                </div>
                <div className={card.class}>
                </div>
            </div>
        );

        return (
            <div>

                <div style={{ display: !this.state.showRoom ? 'block' : 'none' }}>
                    <div>
                        <div>
                            <h1>
                                {this.state.code}
                            </h1>
                            <button onClick={this.CreateRoom}>
                                Create Room
                    </button>
                            <form
                                className="mt-5 py-5 px-5"
                                autoComplete="off"
                                onSubmit={this.handleSubmit}
                            >
                                <input onChange={this.handleChange} type='number' value={this.state.email} />
                                <button type="submit"  >join room</button>

                            </form>
                        </div>
                    </div>
                </div>
                <div style={{ display: this.state.showRoom ? 'block' : 'none' }}>
                    <nav class="navbar navbar-expand-lg navbar-light bg-light">

                        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                            <div class="navbar-nav">
                                <a class="nav-item nav-link active" href="#">Rang card game</a>
                                <a class="nav-item nav-link" href="#" >Distribute</a>
                                <a class="nav-item nav-link" href="#">declare winner</a>
                                <a class="nav-item nav-link" href="#">Endgame</a>
                                <a class="nav-item nav-link" href="#">Choose 1 player</a>
                            </div>
                        </div>
                    </nav>
                    <div>
                        {this.state.code}{this.state.joincode}
                    </div>
                    <div className='count'>
                        <button type="button" class=" mb-3 btn btn-success">
                            Players online: <span class="badge badge-light"> {this.state.players}</span>
                        </button>
                    </div>

                    <br />

                    <div class="row">
                        <div class="card text-white bg-primary mb-3" style={{ 'max-width': '18rem', 'float': 'left' }}>
                            <div class="card-header">Player 1</div>
                            <div class="card-body">
                                <h5 class="card-title">

                                </h5>
                                <p class="card-text">
                                    {this.state.allUsers[0] != null ? this.state.allUsers[0].name : ''}
                                </p>
                            </div>
                        </div>
                        <div class="deck">
                            {this.state.active1}
                        </div>
                        <div class="deck">
                            {this.state.active2}
                        </div>
                        <div class="deck">
                            {this.state.active3}
                        </div>
                        <div class="deck">
                            {this.state.active4}
                        </div>
                        <div class="col-4 mb-3"></div>
                        <div class="col-4 mb-3"></div>
                        <div class="card text-white bg-primary mb-3" style={{ 'max-width': '18rem', 'float': 'right' }}>
                            <div class="card-header">Player 2</div>
                            <div class="card-body">
                                <h5 class="card-title">
                                </h5>
                                <p class="card-text"> {this.state.allUsers[1] != null ? this.state.allUsers[1].name : ''}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="card text-white bg-primary mb-3" style={{ 'max-width': '18rem', 'float': 'left' }}>
                            <div class="card-header">Player 3</div>
                            <div class="card-body">
                                <h5 class="card-title">

                                </h5>
                                <p class="card-text">{this.state.allUsers[2] != null ? this.state.allUsers[2].name : ''}


                                </p>
                            </div>
                        </div>
                        <div class="col-4 mb-3"></div>
                        <div class="col-4 mb-3"></div>
                        <div class="card text-white bg-primary mb-3" style={{ 'max-width': '18rem', 'float': 'right' }}>
                            <div class="card-header">Player 4</div>
                            <div class="card-body">
                                <h5 class="card-title">

                                </h5>
                                <p class="card-text"> {this.state.allUsers[3] != null ? this.state.allUsers[3].name : ''}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="deck">
                        {showCards}
                    </div>
                </div >


            </div>
        );
    }

}


// const requestOptions = {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//         id: 0,
//         name: "abdullah",
//         active: true,
//         room: randomcode
//     })
// };
// const response = await fetch('https://localhost:5001/api/user', requestOptions);
// const data = await response.json();
// console.log(data);