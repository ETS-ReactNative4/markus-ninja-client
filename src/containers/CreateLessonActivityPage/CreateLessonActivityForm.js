import * as React from 'react'
import cls from 'classnames'
import {
  createFragmentContainer,
} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import getHistory from 'react-router-global-history'
import MaterialTextField, {HelperText, Input} from '@material/react-text-field'
import ErrorText from 'components/ErrorText'
import TextField, {defaultTextFieldState} from 'components/TextField'
import CreateActivityMutation from 'mutations/CreateActivityMutation'
import ActivityStudyDialog from './ActivityStudyDialog'
import {isEmpty, isNil} from 'utils'

class CreateLessonActivityForm extends React.Component {
  state = {
    activityStudyDialogOpen: false,
    error: null,
    description: defaultTextFieldState,
    study: null,
    name: {
      ...defaultTextFieldState,
      initialValue: this.props.lesson.title,
      value: this.props.lesson.title,
    }
  }

  handleChange = (field) => {
    this.setState({
      [field.name]: field,
    })
  }


  handleSelectStudy = (study) => {
    this.setState({study})
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const {description, study,  name} = this.state
    CreateActivityMutation(
      study.id,
      this.props.lesson.id,
      name.value,
      description.value,
      (activity, errors) => {
        if (!isNil(errors)) {
          this.setState({ error: errors[0].message })
          return
        }
        getHistory().push(activity.resourcePath)
      },
    )
  }

  handleToggleActivityStudyDialog = () => {
    const {activityStudyDialogOpen} = this.state
    this.setState({
      activityStudyDialogOpen: !activityStudyDialogOpen,
    })
  }

  get classes() {
    const {className} = this.props
    return cls("CreateLessonActivityForm mdc-layout-grid__inner", className)
  }

  get isFormValid() {
    const {description, study, name} = this.state
    return !isEmpty(name.value) && name.valid &&
      description.valid && !isEmpty(study.id)
  }

  render() {
    const {lesson} = this.props
    const {activityStudyDialogOpen, error, study, name} = this.state

    return (
      <form className={this.classes} onSubmit={this.handleSubmit}>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <button
            type="button"
            className="mdc-button mdc-button--unelevated mdc-theme--secondary-bg"
            onClick={this.handleToggleActivityStudyDialog}
          >
            Select Study
          </button>
          <button
            type="button"
            className="mdc-button mdc-theme--secondary ml2"
            onClick={() => this.setState({study: lesson.study})}
          >
            Select This Study
          </button>
        </div>
        <input
          type="hidden"
          required
          value={study ? study.id : ""}
        />
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-8-desktop mdc-layout-grid__cell--span-8-tablet">
          <MaterialTextField
            className="rn-form__input"
            label="Study"
          >
            <Input
              onClick={this.handleToggleActivityStudyDialog}
              name="study"
              required
              value={study ? `${study.nameWithOwner}`: ""}
            />
          </MaterialTextField>
        </div>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-8-desktop mdc-layout-grid__cell--span-8-tablet">
          <MaterialTextField
            className="rn-form__input"
            label="Lesson"
            floatingLabelClassName="mdc-floating-label--float-above"
          >
            <Input
              name="lesson"
              disabled
              value={lesson.title}
            />
          </MaterialTextField>
        </div>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-8-desktop mdc-layout-grid__cell--span-8-tablet">
          <TextField
            className="rn-form__input"
            label="Activity name"
            inputProps={{
              name: "name",
              required: true,
              onChange: this.handleChange,
              value: name.value,
            }}
          />
        </div>
        <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <TextField
            textarea
            label="Description (optional)"
            helperText={<HelperText>Give a brief description of the activity.</HelperText>}
            inputProps={{
              name: "description",
              onChange: this.handleChange,
            }}
          />
        </div>
        <div className="mdc-layout-grid__cell">
          <button
            type="submit"
            className="mdc-button mdc-button--unelevated"
          >
            Create activity
          </button>
        </div>
        <ErrorText
          className="mdc-layout-grid__cell mdc-layout-grid__cell--span-12"
          error={error}
        />
        <ActivityStudyDialog
          open={activityStudyDialogOpen}
          onClose={this.handleToggleActivityStudyDialog}
          onSelect={this.handleSelectStudy}
        />
      </form>
    )
  }
}

export default createFragmentContainer(CreateLessonActivityForm, graphql`
  fragment CreateLessonActivityForm_lesson on Lesson {
    id
    study {
      id
      nameWithOwner
    }
    title
  }
`)
