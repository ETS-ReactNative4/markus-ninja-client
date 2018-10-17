import * as React from 'react'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import TextField, {Icon, Input} from '@material/react-text-field'
import Dialog from 'components/Dialog'
import StudyLessons from 'components/StudyLessons'
import LessonPreview from 'components/LessonPreview'
import AddCourseLessonMutation from 'mutations/AddCourseLessonMutation'

const Lessons = ({lessons}) => (
  <ul className="mdc-list mdc-list--two-line">
    {lessons.edges.map(({node}) => (
      node && <LessonPreview.List key={node.id} lesson={node} />
    ))}
  </ul>
)

class AddCourseLessonDialog extends React.Component {
  state = {
    lessonId: "",
    query: "",
  }

  handleCancel = () => {
    this.setState({query: ""})
    this.props.onClose()
  }

  handleChange = (e) => {
    this.setState({
      query: e.target.value,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { lessonId } = this.state
    AddCourseLessonMutation(
      this.props.course.id,
      lessonId,
      (response, errors) => {
        if (errors) {
          this.setState({ error: errors[0].message })
        }
      }
    )
  }

  get _filterBy() {
    const {query} = this.state
    return {
      isCourseLesson: false,
      search: query,
    }
  }

  render() {
    const {open} = this.props

    return (
      <Dialog
        open={open}
        onClose={this.handleCancel}
        title={<Dialog.Title>Add course lesson</Dialog.Title>}
        content={
          <Dialog.Content>
            {this.renderInput()}
            <StudyLessons filterBy={this._filterBy}>
              <Lessons />
            </StudyLessons>
          </Dialog.Content>}
        actions={
          <Dialog.Actions>
            <button
              type="button"
              className="mdc-button"
              data-mdc-dialog-action="close"
            >
              Cancel
            </button>
            <button
              type="button"
              className="mdc-button mdc-button--unelevated"
              onClick={this.handleSubmit}
              data-mdc-dialog-action="add"
            >
              Add
            </button>
          </Dialog.Actions>}
      />
    )
  }

  renderInput() {
    const {query} = this.state

    return (
      <TextField
        fullWidth
        label="Find a lesson..."
        trailingIcon={<Icon><i className="material-icons">search</i></Icon>}
      >
        <Input
          name="query"
          autoComplete="off"
          placeholder="Find a lesson..."
          value={query}
          onChange={this.handleChange}
        />
      </TextField>
    )
  }

  renderLessons() {
  }
}

export default createFragmentContainer(AddCourseLessonDialog, graphql`
  fragment AddCourseLessonDialog_course on Course {
    id
    viewerCanAdmin
  }
`)
