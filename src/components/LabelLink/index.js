import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
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

LabelLink.propTypes = {
  label: PropTypes.shape({
    color: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    resourcePath: PropTypes.string.isRequired,
  }).isRequired,
}

LabelLink.defaultProps = {
  label: {
    color: "",
    id: "",
    name: "",
    resourcePath: "",
  }
}

export default LabelLink
