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
            active: null,
            error: null,
            user: auth().currentUser,
            firstplayer: [{}],
            Secondplayer: [{}],
            thirdplayer: [{}],
            forthplayer: [{}],
            cards: Array(51).fill({ null: null }),
            code: null,
            joincode: null,
            showRoom: null,
            identity: {},

        };
        this.MakeCards = this.MakeCards.bind(this);
        this.Showfirstplayercards = this.Showfirstplayercards.bind(this);
        this.playCard = this.playCard.bind(this);
        this.CreateRoom = this.CreateRoom.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    mapToCards(value) {
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
    MakeCards() {
        let Tcards = []

        //    const cards={};

        for (let count = 0; count < 13; count++) {
            Tcards[count] = {
                name: "Spades",
                title: this.mapToCards(count + 2),
                value: count + 2,
                class: "suit Spade"
            }

        }
        for (let count = 13; count < 26; count++) {
            Tcards[count] = {
                name: " Diamonds",
                title: this.mapToCards(count - 11),
                value: count - 11,
                class: "suit diamonds"
            }

        }
        for (let count = 26; count < 39; count++) {
            Tcards[count] = {
                name: "Heart",
                title: this.mapToCards(count - 24),
                value: count - 24,
                class: "suit hearts"
            }

        }
        for (let count = 39; count < 52; count++) {
            Tcards[count] = {
                name: "Clubs",
                title: this.mapToCards(count - 37),
                value: count - 37,
                class: "suit clubs"
            }

        }



        const shuffled = Tcards.sort(() => 0.5 - Math.random());

        this.setState({
            firstplayer: shuffled.slice(0, 13),
            secondplayer: shuffled.slice(13, 26),
            thirdplayer: shuffled.slice(26, 39),
            fourthplayer: shuffled.slice(39, 52),
            cards: shuffled
        })
        console.log(shuffled);
        return;

    }
    playCard(card) {



        let deck1 = this.state.firstplayer;
        let index = deck1.indexOf(card);
        if (index !== -1) {
            deck1.splice(index, 1);
            this.setState({
                firstplayer: deck1,
                active: card
            });


        }

    }


    Showfirstplayercards() {
        this.setState({
            firstplayer: this.state.firstplayer
        })
        console.log(this.state.firstplayer);
    }
    async CreateRoom() {
        const randomcode = Math.floor(Math.random() * 100000) + 1;
        await this.setState({
            code: randomcode,
            identity: { name: 'kaleem', sendcode: randomcode, id: 1 },
            showRoom: true
        }

        );
        socket.emit("Requesttojoinroom", this.state.identity);


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
           await this.setState({identity:{name:'kaleem',sendcode:this.state.joincode,id:null}})
            //connect with server and send him the code to the room the server will check the people in the room and then rply according
            socket.emit("Requesttojoinroom", this.state.identity)
            socket.on("FromAPI", (data) => {
                console.log(data);
                this.setState({
                    showRoom: data,
                    })
            }
            )
        }
    }

    render() {

        const cardsItems = this.state.firstplayer.map((card) =>

            <div class="card" onClick={() => { this.playCard(card) }}>
                <div class="value" card-value={card.value}>{card.title}
                </div>
                <div className={card.class}>
                </div>
            </div>
        );
        // displayCards(){
        //     cardsItems.map()
        // }
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
                                <a class="nav-item nav-link" href="#" onClick={this.MakeCards}>Distribute</a>
                                <a class="nav-item nav-link" href="#">declare winner</a>
                                <a class="nav-item nav-link" href="#">Endgame</a>
                                <a class="nav-item nav-link" href="#">Choose 1 player</a>
                            </div>
                        </div>
                    </nav>
                    <div>
                        {this.state.user.email}
                    </div>
                    <div className='count'>
                        <button type="button" class=" mb-3 btn btn-success">
                            Players online: <span class="badge badge-light"> {this.state.count}</span>
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
                                    {this.state.user.email}
                                </p>
                            </div>
                        </div>
                        <div class="deck">
                            <div class="card" >
                                <div class="value">{this.state.active != null ? this.state.active.title : ''}
                                </div>
                                <div className={this.state.active != null ? this.state.active.class : ''}>
                                </div>
                            </div>
                        </div>
                        <div class="col-4 mb-3"></div>
                        <div class="col-4 mb-3"></div>
                        <div class="card text-white bg-primary mb-3" style={{ 'max-width': '18rem', 'float': 'right' }}>
                            <div class="card-header">Player 2</div>
                            <div class="card-body">
                                <h5 class="card-title">

                                </h5>
                                <p class="card-text">cards coming...</p>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="card text-white bg-primary mb-3" style={{ 'max-width': '18rem', 'float': 'left' }}>
                            <div class="card-header">Player 3</div>
                            <div class="card-body">
                                <h5 class="card-title">

                                </h5>
                                <p class="card-text">cards coming...</p>
                            </div>
                        </div>
                        <div class="col-4 mb-3"></div>
                        <div class="col-4 mb-3"></div>
                        <div class="card text-white bg-primary mb-3" style={{ 'max-width': '18rem', 'float': 'right' }}>
                            <div class="card-header">Player 4</div>
                            <div class="card-body">
                                <h5 class="card-title">

                                </h5>
                                <p class="card-text">cards coming...</p>
                            </div>
                        </div>
                    </div>

                    <div className="deck">
                        {cardsItems}
                    </div>
                </div >


            </div>
        );
    }

}

