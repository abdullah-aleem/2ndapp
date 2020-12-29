import React, { useEffect } from 'react';
import useGlobalCounter from './globalvar';

 export default function Counter(props) {
    const [state, setState] = useGlobalCounter()
    useEffect(() => {setState(state + 1)}, []);
    return (
      <div>
        <p>State: {state}</p>
      </div>
    )
}