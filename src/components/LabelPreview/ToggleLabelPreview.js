import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import {withRouter} from 'react-router-dom'
import getHistory from 'react-router-global-history'
import Label from 'components/Label'
import AddLabelMutation from 'mutations/AddLabelMutation'
import RemoveLabelMutation from 'mutations/RemoveLabelMutation'
import {get} from 'utils'

class ToggleLabelPreview extends React.Component {
  state = {
    loading: false,
  }

  handleLabelChecked_ = (labelId, checked) => {
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
          if (errors) {
            console.error(errors[0].message)
          }
          this.setState({loading: false})
          this.props.onLabelChecked(checked)
        },
      )
    } else {
      this.setState({loading: true})
      RemoveLabelMutation(
        labelId,
        this.props.labelableId,
        (response, errors) => {
          if (errors) {
            console.error(errors[0].message)
          }
          this.setState({loading: false})
          this.props.onLabelChecked(checked)
        },
      )
    }
  }

  handleClick_ = (e) => {
    const {disabled, label, selected} = this.props

    if (disabled) {
      getHistory().push(label.resourcePath)
    } else {
      this.handleLabelChecked_(label.id, !selected)
    }
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
    const {selected} = this.props

    return (
      <Label
        {...this.otherProps}
        className={this.classes}
        selected={selected}
        label={get(this.props, "label", null)}
        onClick={this.handleClick_}
      />
    )
  }
}

ToggleLabelPreview.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.shape({
    id: PropTypes.string.isRequired,
    resourcePath: PropTypes.string.isRequired,
  }).isRequired,
  labelableId: PropTypes.string.isRequired,
  onLabelChecked: PropTypes.func,
  selected: PropTypes.bool,
}

ToggleLabelPreview.defaultProps = {
  disabled: false,
  label: {
    id: "",
    resourcePath: "",
  },
  labelableId: "",
  onLabelChecked: () => {},
  selected: true,
}

export default withRouter(createFragmentContainer(ToggleLabelPreview, graphql`
  fragment ToggleLabelPreview_label on Label {
    ...Label_label
    id
    resourcePath
  }
`))
