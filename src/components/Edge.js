import * as React from 'react'
import { get } from 'utils'

class Edge extends React.Component {
  render() {
    const { edge, render } = this.props
    if (!get(edge, "node", null)) {
      return null
    }
    return render(edge)
  }
}

export default Edge
