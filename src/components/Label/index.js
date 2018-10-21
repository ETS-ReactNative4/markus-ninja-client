import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import tinycolor from 'tinycolor2'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import {get} from 'utils'

import "./styles.css"

export class Label extends React.Component {
  state = {
    backgroundColor: this.color,
  }

  componentDidUpdate(prevProps) {
    const oldLabel = get(prevProps, "label", {})
    const newLabel = get(this.props, "label", {})

    if (oldLabel.color !== newLabel.color) {
      this.setState({backgroundColor: this.color})
    }
  }

  get classes() {
    const {className, selected} = this.props
    const {backgroundColor} = this.state
    const isDark = backgroundColor.isDark()

    return cls("Label mdc-chip", className, {
      "mdc-chip-selected": selected,
      "Label--selected": selected,
      "Label--dark": isDark,
      "Label--light": !isDark,
    })
  }

  get color() {
    let color = get(this.props, "label.color", "")
    if (!color.match(/^#(?:[0-9a-fA-F]{3}){1,2}$/g)) {
      color = "#e0e0e0"
    }
    return tinycolor(color)
  }

  render() {
    const {
      as: Component,
      label,
      onClick,
      selected,
      ...otherProps
    } = this.props
    const {backgroundColor} = this.state
    const style = selected ? {backgroundColor: backgroundColor.toHexString()} : null

    return (
      <Component
        {...otherProps}
        className={this.classes}
        style={style}
        onClick={onClick}
      >
        <div className="mdc-chip__text">{label.name}</div>
      </Component>
    )
  }
}

Label.propTypes = {
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  className: PropTypes.string,
  label: PropTypes.shape({
    color: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func,
  selected: PropTypes.bool,
}

Label.defaultProps = {
  as: 'div',
  className: "",
  label: {
    color: "",
    name: "",
  },
  onClick: () => {},
  selected: true,
}

export default createFragmentContainer(Label, graphql`
  fragment Label_label on Label {
    color
    name
  }
`)
