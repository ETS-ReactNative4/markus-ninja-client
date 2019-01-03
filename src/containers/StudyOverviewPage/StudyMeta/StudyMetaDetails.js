import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import { withRouter } from 'react-router-dom';
import {HelperText} from '@material/react-text-field'
import TextField, {defaultTextFieldState} from 'components/TextField'
import UpdateStudyMutation from 'mutations/UpdateStudyMutation'
import { get, isEmpty, isNil } from 'utils'

class StudyMetaDetails extends React.Component {
  constructor(props) {
    super(props)

    const description = get(this.props, "study.description", "")

    this.state = {
      error: null,
      description: {
        ...defaultTextFieldState,
        value: description,
        valid: true,
      },
      open: false,
    }
  }

  handleCancel = () => {
    this.setState({open: false})
    this.props.onClose()
    this.reset_()
  }

  handleChange = (field) => {
    this.setState({
      [field.name]: field,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { description } = this.state
    UpdateStudyMutation(
      this.props.study.id,
      description.value,
      null,
      (error) => {
        if (!isNil(error)) {
          this.setState({ error: error.message })
        }
        this.handleToggleOpen()
      },
    )
  }

  handleToggleOpen = () => {
    const open = !this.state.open

    this.setState({ open })
    this.props.onOpen(open)
  }

  reset_ = () => {
    const study = get(this.props, "study", {})
    this.setState({
      error: null,
      description: {
        ...defaultTextFieldState,
        value: study.description,
        valid: true,
      },
    })
  }

  get classes() {
    const {className} = this.props
    return cls("mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  render() {
    const study = get(this.props, "study", {})
    const {open} = this.state

    return (
      <div className={this.classes}>
        {open && study.viewerCanAdmin
        ? this.renderForm()
        : this.renderDetails()}
      </div>
    )
  }

  renderHelperText() {
    return (
      <HelperText persistent>Give a brief description of the course.</HelperText>
    )
  }

  renderForm() {
    const {description} = this.state

    return (
      <form onSubmit={this.handleSubmit}>
        <TextField
          className="w-100"
          label="Description"
          textarea
          floatingLabelClassName={!isEmpty(description) ? "mdc-floating-label--float-above" : ""}
          helperText={this.renderHelperText()}
          inputProps={{
            name: "description",
            value: description.value,
            onChange: this.handleChange,
          }}
        />
        <div className="inline-flex items-center mt2">
          <button
            type="submit"
            className="mdc-button mdc-button--unelevated"
          >
            Save
          </button>
          <button
            className="mdc-button ml2"
            type="button"
            onClick={this.handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    )
  }

  renderDetails() {
    const study = get(this.props, "study", {})

    return (
      <div className="rn-description">
        <div className={cls("mdc-theme--subtitle1 flex-auto", {
          "mdc-theme--text-secondary-on-light": !study.description,
        })}>
          {study.description || "No description provided"}
        </div>
        {study.viewerCanAdmin &&
        <div className="inline-flex">
          <button
            className="material-icons mdc-icon-button mdc-theme--text-icon-on-background"
            type="button"
            onClick={this.handleToggleOpen}
          >
            edit
          </button>
        </div>}
      </div>
    )
  }
}

StudyMetaDetails.propTypes = {
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
}

StudyMetaDetails.defaulProps = {
  onClose: () => {},
  onOpen: () => {},
}

export default withRouter(createFragmentContainer(StudyMetaDetails, graphql`
  fragment StudyMetaDetails_study on Study {
    description
    id
    viewerCanAdmin
  }
`))
