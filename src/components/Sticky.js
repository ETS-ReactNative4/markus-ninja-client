import * as React from 'react'
import ReactSticky from 'react-stickynode'
import {onElementHeightChange} from 'utils'

class Sticky extends React.Component {
  stickyElement_ = React.createRef()

  componentDidMount() {
    onElementHeightChange(document.body, this.updateSticky)
  }

  componentWillUnmount() {
    clearTimeout(document.body.onElementHeightChangeTimer)
  }

  updateSticky = (delta) => {
    const stickyElement = this.stickyElement_ && this.stickyElement_.current
    if (stickyElement) {
      stickyElement.scrollTop += delta
      this.stickyElement_.current.update()
    }
  }

  render() {
    const {children, ...otherProps} = this.props

    return <ReactSticky ref={this.stickyElement_} {...otherProps}>{children}</ReactSticky>
  }
}

export default Sticky
