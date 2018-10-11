import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import tinycolor from 'tinycolor2'
import {Link} from 'react-router-dom'
import {get} from 'utils'

import "./styles.css"

class LabelLink extends React.Component {
  state = {
    backgroundColor: tinycolor(get(this.props, "label.color", "")),
    loading: false,
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

    return cls("LabelLink mdc-chip", className, {
      "mdc-chip-selected": true,
      "LabelLink--dark": isDark,
      "LabelLink--light": !isDark,
    })
  }

  render() {
    const label = get(this.props, "label", {})
    const style = {backgroundColor: label.color}

    return (
      <Link
        className={this.classes}
        style={style}
        to={label.resourcePath}
      >
        <div className="mdc-chip__text">{label.name}</div>
      </Link>
    )
  }
}

export default createFragmentContainer(LabelLink, graphql`
  fragment LabelLink_label on Label {
    color
    id
    name
    resourcePath
  }
`)
