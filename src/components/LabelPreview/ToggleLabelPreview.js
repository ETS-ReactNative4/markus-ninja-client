import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import Label from 'components/Label'
import AddLabelMutation from 'mutations/AddLabelMutation'
import RemoveLabelMutation from 'mutations/RemoveLabelMutation'
import {get, isNil} from 'utils'

class ToggleLabelPreview extends React.Component {
  state = {
    loading: false,
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

    this.props.onLabelChecked(checked)
  }

  get classes() {
    const {className} = this.props
    return cls("ToggleLabelPreview", className)
  }

  get otherProps() {
    const {
      disabled,
      label,
      labelableId,
      onLabelChecked,
      selected,
      ...otherProps
    } = this.props
    return otherProps
  }

  render() {
    const {disabled, selected} = this.props
    const labelId = get(this.props, "label.id", "")
    const onClick = !disabled
      ? () => {
        this.handleLabelChecked(labelId, !selected)
      }
      : null

    return (
      <Label
        {...this.otherProps}
        className={this.classes}
        selected={selected}
        label={get(this.props, "label", null)}
        onClick={onClick}
      />
    )
  }
}

ToggleLabelPreview.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  labelableId: PropTypes.string.isRequired,
  onLabelChecked: PropTypes.func,
  selected: PropTypes.bool,
}

ToggleLabelPreview.defaultProps = {
  disabled: false,
  label: {
    id: ""
  },
  labelableId: "",
  onLabelChecked: () => {},
  selected: true,
}

export default createFragmentContainer(ToggleLabelPreview, graphql`
  fragment ToggleLabelPreview_label on Label {
    ...Label_label
    id
  }
`)
