import * as React from 'react'

import './Counter.css'

const Counter = props => {
  return <span className="Counter">{props.children}</span>
}

export default Counter
