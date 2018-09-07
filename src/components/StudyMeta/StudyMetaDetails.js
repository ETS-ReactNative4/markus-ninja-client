import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router-dom';
import TextField, {Input, HelperText} from '@material/react-text-field'
import UpdateStudyMutation from 'mutations/UpdateStudyMutation'
import { get, isEmpty, isNil } from 'utils'
import cls from 'classnames'

class StudyMetaDetails extends Component {
  constructor(props) {
    super(props)

    const description = get(this.props, "study.description", "")

    this.state = {
      error: null,
      description,
      initialValues: {
        description,
      },
      open: false,
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { description } = this.state
    UpdateStudyMutation(
      this.props.study.id,
      description,
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

    this.reset_()
  }

  reset_ = () => {
    this.setState({
      error: null,
      ...this.state.initialValues,
    })
  }

  get classes() {
    const {className} = this.props
    return cls("StudyMetaDetails mdc-layout-grid__cell mdc-layout-grid__cell--span-12", className)
  }

  render() {
    const study = get(this.props, "study", {})
    const {open} = this.state

    return (
      <div className={this.classes}>
        {open
        ? study.viewerCanAdmin && this.renderForm()
        : this.renderDetails()}
      </div>
    )
  }

  renderHelperText() {
    return (
      <HelperText>Give a brief description of the course.</HelperText>
    )
  }

  renderForm() {
    const {description} = this.state

    return (
      <form className="StudyMeta__form inline-flex w-100" onSubmit={this.handleSubmit}>
        <div className="flex-auto">
          <TextField
            className="w-100"
            label="Description"
            outlined
            floatingLabelClassName={!isEmpty(description) ? "mdc-floating-label--float-above" : ""}
            helperText={this.renderHelperText()}
          >
            <Input
              name="description"
              value={description}
              onChange={this.handleChange}
            />
          </TextField>
        </div>
        <div className="inline-flex items-center pa2 mb4">
          <button
            className="mdc-button mdc-button--unelevated"
            type="submit"
            onClick={this.handleSubmit}
          >
            Save
          </button>
          <span
            className="pointer pa2 underline-hover"
            role="button"
            onClick={this.handleToggleOpen}
          >
            Cancel
          </span>
        </div>
      </form>
    )
  }

  renderDetails() {
    const study = get(this.props, "study", {})

    return (
      <div className="inline-flex items-center w-100">
        <div className={cls("mdc-theme--subtitle1 flex-auto", {
          "mdc-theme--text-secondary-on-light": !study.description,
        })}>
          {study.description || "No description provided"}
        </div>
        {study.viewerCanAdmin &&
        <div className="inline-flex">
          <button
            className="material-icons mdc-icon-button"
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
  onOpen: PropTypes.func,
}

StudyMetaDetails.defaulProps = {
  onOpen: () => {}
}

export default withRouter(createFragmentContainer(StudyMetaDetails, graphql`
  fragment StudyMetaDetails_study on Study {
    description
    id
    viewerCanAdmin
  }
`))
