import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {
  createFragmentContainer,
  graphql,
} from 'react-relay'
import TextField, {Icon, Input} from '@material/react-text-field'
import Dialog from 'components/Dialog'
import StudyLessons from 'components/StudyLessons'
import LessonPreview from 'components/LessonPreview'
import AddCourseLessonMutation from 'mutations/AddCourseLessonMutation'
import {get, isEmpty} from 'utils'

class Lessons extends React.Component {
  state = {
    lessonId: "",
  }

  handleSelect = (lessonId) => {
    this.setState({lessonId})
    this.props.onSelect(lessonId)
  }

  render() {
    const {lessonId} = this.state
    const {lessons} = this.props
    const edges = get(lessons, "edges", [])
    const noResults = isEmpty(edges)

    return (
      <ul className="mdc-list">
        {noResults
        ? <li className="mdc-list-item">No lessons found</li>
        : edges.map(({node}) => (
            node &&
            <LessonPreview.Select
              key={node.id}
              lesson={node}
              selected={lessonId === node.id}
              onClick={this.handleSelect}
            />
          ))}
      </ul>
    )
  }
}

Lessons.propTypes = {
  onSelect: PropTypes.func.isRequired,
}

Lessons.defaultProps = {
  onSelect: () => {},
}

class AddCourseLessonDialog extends React.Component {
  state = {
    lessonsFetched: false,
    lessonId: "",
    query: "",
  }

  componentDidUpdate(prevProps) {
    const {lessonsFetched} = this.state
    if (!lessonsFetched && !prevProps.open && this.props.open) {
      this.setState({lessonsFetched: true})
    }
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

  handleSelectLesson = (lessonId) => {
    this.setState({lessonId})
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
        this.setState({
          lessonsFetched: false,
          lessonId: "",
          query: "",
        })
      }
    )
  }

  get classes() {
    const {className} = this.props
    return cls("AddCourseLessonDialog", className)
  }

  get _filterBy() {
    const {query} = this.state
    return {
      isCourseLesson: false,
      search: query,
    }
  }

  render() {
    const {lessonsFetched} = this.state
    const {open} = this.props

    return (
      <Dialog
        className={this.classes}
        open={open}
        onClose={this.handleCancel}
        title={<Dialog.Title>Add course lesson</Dialog.Title>}
        content={
          <Dialog.Content>
            {this.renderInput()}
            {(open || lessonsFetched) &&
            <StudyLessons filterBy={this._filterBy} fragment="select">
              <Lessons onSelect={this.handleSelectLesson} />
            </StudyLessons>}
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
}

AddCourseLessonDialog.propTypes = {
  onClose: PropTypes.func,
}

AddCourseLessonDialog.defaultProps = {
  onClose: () => {},
}

export default createFragmentContainer(AddCourseLessonDialog, graphql`
  fragment AddCourseLessonDialog_course on Course {
    id
    viewerCanAdmin
  }
`)
