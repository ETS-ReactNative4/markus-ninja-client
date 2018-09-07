import * as React from 'react'
import cls from 'classnames'
import tinycolor from 'tinycolor2'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { Link } from 'react-router-dom'
import { get } from 'utils'

import "./styles.css"

class Label extends React.Component {
  state = {
    backgroundColor: tinycolor(),
  }

  componentDidUpdate(prevProps) {
    const oldLabel = get(prevProps, "label", {})
    const newLabel = get(this.props, "label", {})

    if (oldLabel.color !== newLabel.color) {
      this.setState({backgroundColor: newLabel.color})
    }
  }

  get classes() {
    const {className} = this.props
    const {backgroundColor} = this.state
    const isDark = backgroundColor.isDark()

    return cls("Label", className, {
      "Label--dark": isDark,
      "Label--light": !isDark,
    })
  }

  render() {
    const label = get(this.props, "label", {})

    return (
      <Link
        className={this.classes}
        to={label.resourcePath}
        style={{backgroundColor: label.color}}
      >
        {label.name}
      </Link>
    )
  }
}

export default createFragmentContainer(Label, graphql`
  fragment Label_label on Label {
    color
    name
    resourcePath
  }
`)
