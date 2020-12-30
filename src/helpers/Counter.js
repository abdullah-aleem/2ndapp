import React, { useEffect } from 'react';
import useGlobalCounter from './globalvar';

 export default function Counter(props) {
    const [state, setState] = useGlobalCounter()
//useEffect(() => {setState(state + 1)}, []);
    return (
      <div>
        <p>State: {state}</p>
      </div>
    )
}

// var card = new Card (){};

// var cards = [ cardi1, card2, card3 .........];

// var lot1 = Math.random(cards * 13);

// for(id)
// cards.removeat(lot1);


// player1 = lot1;l
