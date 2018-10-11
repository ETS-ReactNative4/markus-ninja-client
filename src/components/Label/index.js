import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import tinycolor from 'tinycolor2'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import AddLabelMutation from 'mutations/AddLabelMutation'
import RemoveLabelMutation from 'mutations/RemoveLabelMutation'
import {get, isNil} from 'utils'

import "./styles.css"

class Label extends React.Component {
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

  handleLabelChecked = (labelId, checked) => {
    const {loading} = this.state
    if (loading) {
      console.log("request is already pending")
      return
    }
    if (checked) {
      this.setState({loading: true})
      AddLabelMutation(
        labelId,
        this.props.labelableId,
        (response, errors) => {
          if (!isNil(errors)) {
            console.error(errors[0].message)
          }
          this.setState({loading: false})
        },
      )
    } else {
      this.setState({loading: true})
      RemoveLabelMutation(
        labelId,
        this.props.labelableId,
        (response, errors) => {
          if (!isNil(errors)) {
            console.error(errors[0].message)
          }
          this.setState({loading: false})
        },
      )
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

  render() {
    const {disabled, selected} = this.props
    const label = get(this.props, "label", {})
    const style = selected ? {backgroundColor: label.color} : null
    const onClick = !disabled
      ? () => {
        this.handleLabelChecked(label.id, !selected)
      }
      : null

    return (
      <div
        className={this.classes}
        style={style}
        onClick={onClick}
      >
        <div className="mdc-chip__text">{label.name}</div>
      </div>
    )
  }
}

Label.propTypes = {
  disabled: PropTypes.bool,
  selected: PropTypes.bool,
}

Label.defaultProps = {
  disabled: false,
  selected: true
}

export default createFragmentContainer(Label, graphql`
  fragment Label_label on Label {
    color
    id
    name
    resourcePath
  }
`)
