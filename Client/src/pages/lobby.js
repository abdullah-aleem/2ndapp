import React, { Component } from 'react';

import { useHistory } from 'react-router-dom';
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:4001";
var connectionOptions =  {
    "force new connection" : true,
    "reconnectionAttempts": "Infinity", //avoid having user reconnect manually in order to prevent dead clients after a server restart
    "timeout" : 10000,                  //before connect_error and connect_timeout are emitted.
    "transports" : ["websocket"]
};
export default class Lobby extends Component {

    constructor(props) {
        super(props);
        this.state = {
            code: null,
            joincode:null
        };
        this.CreateRoom = this.CreateRoom.bind(this);
        
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    async CreateRoom() {
        const randomcode = Math.floor(Math.random() * 100000) + 1;
        this.setState({
            code: randomcode
        }

        );
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
        // this.props.history.push(`/playarea/${data.room}`)

    }
    componentDidMount()
    {

    }
    
    handleChange(event){
        this.setState({
            joincode:event.target.value,
        })
    }
    handleSubmit(event)
    {
        event.preventDefault();
        if(!this.state.joincode){}
        else
        {
            //connect with server and send him the code to the room the server will check the people in the room and then rply according
            const socket = socketIOClient(ENDPOINT,connectionOptions);
            socket.emit("Requesttojoinroom",this.state.joincode,)  
            socket.on("FromAPI", data => {
                console.log(data);  
            })
        }
    }

    render() {
        return (

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
                        <input onChange={this.handleChange} value={this.state.email}/>
                        <button type="submit"  >join room</button>
                            
                    </form>
                </div>



            </div>

        );
    }
}