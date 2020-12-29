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

CreateRoom(){
    const randomcode=Math.floor(Math.random() * 100000) + 1 ;
this.setState({
    code: randomcode
}
);
this.props.history.push(`/playarea/${randomcode}`)

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