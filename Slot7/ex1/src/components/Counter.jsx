//Dung react bootstrap de tao giao dien dep hon
//

import { useState } from "react";
import Button from 'react-bootstrap/Button'

function Counter (){
    const [count, setCount] = useState(0)
    const increment = () => setCount(count + 1)
        const decrement = () => setCount(count > 0 ? count - 1 : 0)
        const reset = () => setCount(0)
        return (
            <div className="counter">
                <h2>Counter: {count}</h2>
                <Button variant="primary" onClick={increment}>Increment</Button>
                <Button variant="danger" onClick={decrement}>Decrement</Button>
                <Button variant="secondary" onClick={reset}>Reset</Button>
            </div>
        )
}
export default Counter;