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
            
            joincode: null,
            showRoom: null,
            identity: {},
            player: [{}]

        };
       
        this.playCard = this.playCard.bind(this);
        this.CreateRoom = this.CreateRoom.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.whichCardsToShow=this.whichCardsToShow.bind(this);
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


    
    async CreateRoom() {
        const randomcode = Math.floor(Math.random() * 100000) + 1;
        await this.setState({
            code: randomcode,
            identity: { name: this.state.user.email, sendcode: randomcode, id: 1 },

        }

        );
        socket.emit("Requesttojoinroom", this.state.identity);
        socket.on("FromAPI", (data, info, cards) => {
            this.setState({
                showRoom: data,
                identity: info,
                
                firstplayer: cards.slice(0, 13),
                secondplayer: cards.slice(13, 26),
                thirdplayer: cards.slice(26, 39),
                fourthplayer: cards.slice(39, 52),
            });
            console.log(cards);
        }
        )
        this.Findactiveplayer(this.state.identity.id);

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
            await this.setState({ identity: { name: this.state.user, sendcode: this.state.joincode, id: null } })
            //connect with server and send him the code to the room the server will check the people in the room and then rply according
            socket.emit("Requesttojoinroom", this.state.identity)
            socket.on("FromAPI", (data, info, cards) => {
                console.log(data);
                this.setState({
                    showRoom: data,
                    identity: info,
                    
                    firstplayer: cards.slice(0, 13),
                    secondplayer: cards.slice(13, 26),
                    thirdplayer: cards.slice(26, 39),
                    fourthplayer: cards.slice(39, 52),
                })
                console.log(cards);
            }
            

            )
           

        }
        
    }
    
whichCardsToShow()
{ 
    if(this.state.identity.id===1){

        const cardsItems1 =
        
        this.state.firstplayer.map((card) =>
        
        <div class="card" onClick={() => { this.playCard(card) }}>
            <div class="value" card-value={card.value}>{card.title}
            </div>
            <div className={card.class}>
            </div>
        </div>
    );
    console.log(this.state.firstplayer);
    return cardsItems1;
}else if(this.state.identity.id===2){
    const cardsItems2 =
    
    this.state.secondplayer.map((card) =>

        <div class="card" onClick={() => { this.playCard(card) }}>
            <div class="value" card-value={card.value}>{card.title}
            </div>
            <div className={card.class}>
            </div>
        </div>
    );
    return cardsItems2;
}else if(this.state.identity.id===3){
    const cardsItems3 =
    
    this.state.thirdplayer.map((card) =>
    
    <div class="card" onClick={() => { this.playCard(card) }}>
            <div class="value" card-value={card.value}>{card.title}
            </div>
            <div className={card.class}>
            </div>
        </div>
    );
    return cardsItems3;
}else if(this.state.identity.id===4){
    const cardsItems4 =
    
    this.state.fourthplayer.map((card) =>
    
        <div class="card" onClick={() => { this.playCard(card) }}>
            <div class="value" card-value={card.value}>{card.title}
            </div>
            <div className={card.class}>
            </div>
        </div>
    );
    return cardsItems4;
}
}
render() {
    
    const cardsShown= this.whichCardsToShow()
    
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
                        {this.state.identity.sendcode}
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
                                    {this.state.identity.id === 1 ? this.state.user.email : 'cards Comming'}
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
                                <p class="card-text">{this.state.identity.id === 2 ? this.state.user.email : 'cards Comming'}
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
                                <p class="card-text">{this.state.identity.id === 3 ? this.state.user.email : 'cards Comming'}
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
                                <p class="card-text">{this.state.identity.id === 4 ? this.state.user.email : 'cards Comming'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="deck">
                        {cardsShown}
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