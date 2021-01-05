import React,{Component} from 'react';

import { useHistory } from 'react-router-dom';

export default class Lobby extends Component {

constructor(props){
    super(props);
    this.state={
code: null
    };
    this.CreateRoom=this.CreateRoom.bind(this);
}

 async CreateRoom(){
    const randomcode=Math.floor(Math.random() * 100000) + 1 ;
this.setState({
    code: randomcode
}

);
const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        id: 0,
        name: "abdullah",
        active: true,
        room: randomcode
      })
};
const response = await fetch('https://localhost:5001/api/user', requestOptions);
const data = await response.json();
// console.log(data);
this.props.history.push(`/playarea/${data.room}`)

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
                    <button onClick={this.JoinRoom}>
                        Join Room
                    </button>

                </div>



            </div>
            
        );
    }
}