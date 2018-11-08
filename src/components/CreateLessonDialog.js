import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import {withRouter} from 'react-router-dom'
import TextField, {defaultTextFieldState} from 'components/TextField'
import Dialog from 'components/Dialog'
import StudyContext from 'containers/StudyPage/Context'
import CreateLessonMutation from 'mutations/CreateLessonMutation'


const defaultState = {
  error: null,
  title: {
    ...defaultTextFieldState,
    valid: false,
  }
}

class CreateLessonDialog extends React.Component {
  state = defaultState

  handleClose = (action) => {
    const {toggleCreateLessonDialog} = this.context
    this.setState(defaultState)
    toggleCreateLessonDialog()
    this.props.onClose()
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const {title} = this.state

    CreateLessonMutation(
      this.props.study.id,
      title.value,
      (lesson, errors) => {
        if (errors) {
          this.setState({ error: errors[0].message })
          return
        }
        this.props.history.push(lesson.resourcePath)
      }
    )
  }

  get classes() {
    const {className} = this.props
    return cls("CreateLessonDialog", className)
  }

  get isFormValid() {
    const {title} = this.state
    return title.valid
  }

  render() {
    const {open} = this.props

    return (
      <Dialog
        innerRef={this.setRoot}
        className={this.classes}
        open={open}
        onClose={this.handleClose}
        title={
          <Dialog.Title>
            Create lesson
          </Dialog.Title>
        }
        content={
          <Dialog.Content>
            {open && this.renderForm()}
          </Dialog.Content>}
        actions={
          <Dialog.Actions>
            <button
              type="button"
              className="mdc-button"
              data-mdc-dialog-action="cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="create-lesson-form"
              className="mdc-button mdc-button--unelevated"
              data-mdc-dialog-action={this.isFormValid ? "create" : null}
            >
              Create
            </button>
          </Dialog.Actions>}
      />
    )
  }

  renderForm() {
    return (
      <form id="create-lesson-form" onSubmit={this.handleSubmit}>
        <TextField
          fullWidth
          label="Title"
          inputProps={{
            name: "title",
            placeholder: "Title*",
            required: true,
            onChange: (title) => this.setState({title}),
          }}
        />
      </form>
    )
  }
}

CreateLessonDialog.propTypes = {
  onClose: PropTypes.func,
}

CreateLessonDialog.defaultProps = {
  onClose: () => {},
}

CreateLessonDialog.contextType = StudyContext

export default withRouter(createFragmentContainer(CreateLessonDialog, graphql`
  fragment CreateLessonDialog_study on Study {
    id
  }
`))
