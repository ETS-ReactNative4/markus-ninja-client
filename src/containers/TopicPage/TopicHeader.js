import * as React from 'react'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import {withRouter} from 'react-router-dom';
import TextField, {defaultTextFieldState} from 'components/TextField'
import UpdateTopicMutation from 'mutations/UpdateTopicMutation'
import {get, isEmpty, isNil} from 'utils'

class TopicHeader extends React.Component {
  state = {
    error: null,
    open: false,
    description: {
      ...defaultTextFieldState,
      value: get(this.props, "topic.description", ""),
      valid: true,
    }
  }

  handleChange = (field) => {
    this.setState({
      [field.name]: field,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { description } = this.state
    UpdateTopicMutation(
      this.props.topic.id,
      description.value,
      (updatedTopic, errors) => {
        if (!isNil(errors)) {
          this.setState({ error: errors[0].message })
        }
        this.handleToggleOpen()
        this.setState({
          description: get(updatedTopic, "description", ""),
        })
      },
    )
  }

  handleToggleOpen = () => {
    this.setState({ open: !this.state.open })
    this.reset_()
  }

  reset_ = () => {
    const topic = get(this.props, "topic", {})
    this.setState({
      error: null,
      description: {
        ...defaultTextFieldState,
        value: topic.description,
        valid: true,
      },
    })
  }

  render() {
    const topic = get(this.props, "topic", {})
    const {open} = this.state

    return (
      <React.Fragment>
        <h4 className="mdc-layout-grid__cell mdc-layout-grid__cell-span-12">
          {topic.name}
        </h4>
        {open && topic.viewerCanUpdate
        ? this.renderForm()
        : this.renderDetails()}
      </React.Fragment>
    )
  }

  renderForm() {
    const {description} = this.state

    return (
      <form className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12" onSubmit={this.handleSubmit}>
        <TextField
          className="w-100"
          textarea
          label="Description"
          floatingLabelClassName={!isEmpty(description) ? "mdc-floating-label--float-above" : ""}
          inputProps={{
            name: "description",
            value: description.value,
            onChange: this.handleChange,
          }}
        />
        <div className="flex mt2">
          <button
            type="submit"
            className="mdc-button mdc-button--unelevated"
          >
            Save
          </button>
          <button
            className="mdc-button ml2"
            type="button"
            onClick={this.handleToggleOpen}
          >
            Cancel
          </button>
        </div>
      </form>
      )
    }

  renderDetails() {
    const topic = get(this.props, "topic", {})

    return (
      <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
        <div className="inline-flex w-100">
          <div className="mdc-theme--subtitle1 flex-auto mdc-theme--text-secondary-on-light">
            {topic.description || "No description provided"}
          </div>
          {topic.viewerCanUpdate &&
          <button
            className="material-icons mdc-icon-button mdc-theme--text-icon-on-background"
            type="button"
            onClick={this.handleToggleOpen}
          >
            edit
          </button>}
        </div>
      </div>
    )
  }
}

export default withRouter(createFragmentContainer(TopicHeader, graphql`
  fragment TopicHeader_topic on Topic {
    description
    id
    name
    viewerCanUpdate
  }
`))
