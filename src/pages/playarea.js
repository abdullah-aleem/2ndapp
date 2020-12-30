import React, { Component } from 'react';
import { GlobalCounterProvider } from '../helpers/globalvar'
import Counter from '../helpers/Counter';

class Playarea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            firstplayer:Array(12).fill(null),
            Secondplayer:Array(12).fill(null),
            thirdplayer:Array(12).fill(null),
            forthplayer:Array(12).fill(null)
        };
this.MakeCards=this.MakeCards.bind(this);
this.Showfirstplayercards=this.Showfirstplayercards.bind(this);
    }
    MakeCards(){
        const cards= Array(51).fill({null:null})
        
//    const cards={};
   
   for (let count=0;count<13;count++){
           cards[count]={'Spades':count+2}
           
       }
    for (let count=13;count<26;count++){
        cards[count]={'Diamonds':count-11}
        
    }
    for (let count=26;count<39;count++){
        cards[count]={'Heart':count-24}
        
    }
    for (let count=39;count<52;count++){
        cards[count]={'Clubs':count-37}
        
    }
    
    
    
    const shuffled = cards.sort(() => 0.5 - Math.random());

    this.setState({
        firstplayer:shuffled.slice(0,13),
        secondplayer:shuffled.slice(13,26),
        thirdplayer:shuffled.slice(26,39),
        fourthplayer:shuffled.slice(39,52)
    })
console.log(shuffled);
    return;

}


Showfirstplayercards(){
    this.setState({
        firstplayer:this.state.firstplayer
    })
     console.log(this.state.firstplayer);
}

    render() {

        return (
            <div>


                <div className='tailwindheader'>
                    <header class="text-gray-600 body-font">
                        <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                            <a class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                                </svg>
                                <span class="ml-3 text-xl">Play Area Rang Game</span>
                            </a>
                            <nav class="md:ml-auto flex flex-wrap items-center text-base justify-center">

                                <button class="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0" onClick={this.MakeCards}>Distribute
                                    
                                </button>


                                <button class="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0" onClick={this.Showfirstplayercards}>show player1
                                    
                                </button>


                                <button class="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">Endgame
                                    
                                </button>
                                <a class="mr-5 hover:text-gray-900">Choose 1 player</a>
                            </nav>
                            
                        </div>
                    </header>
                </div>

                <div className='Player1'>
                    <h1>player 1</h1>
                    <h2></h2>
                </div>
                <div className='count'>
                    <GlobalCounterProvider>
                        <div style={{ margin: '20px' }}>
                            <Counter />
                        </div>
                    </GlobalCounterProvider>
                </div>
                <div className='Player2'>
                    <h1>player 2</h1>
                    {/* <h2>{this.state.secondplayer}</h2> */}
                </div>
                <div className='Player3'>
                    <h1>player 3</h1>
                    {/* <h2>{this.state.thirdplayer}</h2> */}
                </div>
                <div className='Player4'>
                    <h1>player 4</h1>
                    {/* <h2>{this.state.fourthplayer.length}</h2> */}
                </div>
            </div>
        );
    }

}
export default Playarea;