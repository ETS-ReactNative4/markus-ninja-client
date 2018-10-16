import * as React from 'react'
import cls from 'classnames'

import './styles.css'

const Counter = props => {
  const {className} = props
  return <span className={cls("Counter", className)}>{props.children}</span>
}

export default Counter
