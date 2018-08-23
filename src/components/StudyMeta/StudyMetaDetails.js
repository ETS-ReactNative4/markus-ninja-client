import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import { withRouter } from 'react-router-dom';
import TextField, {Input} from '@material/react-text-field'
import UpdateStudyMutation from 'mutations/UpdateStudyMutation'
import { get, isNil } from 'utils'
import cls from 'classnames'

class StudyMetaDetails extends Component {
  state = {
    error: null,
    description: this.props.study.description,
    open: false,
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
  }

  get classes() {
    const {className} = this.props
    const {open} = this.state

    return cls("StudyMetaDetails", className, {
      "StudyMetaDetails__open": open,
    })
  }

  render() {
    const study = get(this.props, "study", {})
    const { description, error } = this.state
    return (
      <div className={this.classes}>
        <div className="StudyMetaDetails__show">
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
        {study.viewerCanAdmin &&
        <form className="StudyMetaDetails__edit" onSubmit={this.handleSubmit}>
          <TextField className="flex-auto" label="Description">
            <Input
              name="description"
              value={description}
              onChange={this.handleChange}
            />
          </TextField>
          <div className="inline-flex items-center pa2">
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
          <span>{error}</span>
        </form>}
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
