import * as React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import TextField, {Icon, Input} from '@material/react-text-field'
import Dialog from 'components/Dialog'
import Search from 'components/Search'
import LessonPreview from 'components/LessonPreview'
import {isEmpty} from 'utils'

class Lessons extends React.Component {
  state = {
    lesson: {},
  }

  handleSelect = (lesson) => {
    this.setState({lesson})
    this.props.onSelect(lesson)
  }

  render() {
    const {lesson} = this.state
    const {search} = this.props
    const {dataIsStale, edges, isLoading} = search
    const noResults = isEmpty(edges)

    return (
      <ul className="mdc-list mdc-list--two-line">
        {isLoading && (dataIsStale || noResults)
        ? <li className="mdc-list-item">Loading...</li>
        : noResults
          ? <li className="mdc-list-item">No lessons found</li>
        : edges.map(({node}) => (
            node &&
            <LessonPreview.Select
              key={node.id}
              lesson={node}
              selected={lesson.id === node.id}
              onClick={this.handleSelect}
              twoLine
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

class ActivityLessonDialog extends React.Component {
  state = {
    lessonsFetched: false,
    loading: false,
    query: "",
  }

  componentDidUpdate(prevProps) {
    const {lessonsFetched} = this.state
    if (!lessonsFetched && !prevProps.open && this.props.open) {
      this.setState({lessonsFetched: true})
    }
  }

  handleClose = () => {
    this.setState({query: ""})
    this.props.onClose()
  }

  handleChange = (e) => {
    this.setState({
      query: e.target.value,
    })
  }

  handleSelectLesson = (lesson) => {
    this.props.onSelect(lesson)
  }

  get classes() {
    const {className} = this.props
    return cls("ActivityLessonDialog", className)
  }

  get isLoading() {
    return this.state.loading
  }

  render() {
    const {lessonsFetched, query} = this.state
    const {open} = this.props

    return (
      <Dialog
        className={this.classes}
        open={open}
        onClose={this.handleClose}
        title={
          <Dialog.Title>
            Select a lesson for your activity.
          </Dialog.Title>}
        content={
          <Dialog.Content>
            {this.renderInput()}
            {(open || lessonsFetched) &&
            <Search
              type="LESSON"
              query={query}
              fragment="select"
            >
              <Lessons onSelect={this.handleSelectLesson} />
            </Search>}
          </Dialog.Content>}
        actions={
          <Dialog.Actions>
            <button
              type="button"
              className="mdc-button mdc-button--unelevated"
              data-mdc-dialog-action="ok"
            >
              Ok
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

ActivityLessonDialog.propTypes = {
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
}

ActivityLessonDialog.defaultProps = {
  onClose: () => {},
  onSelect: () => {},
}

export default ActivityLessonDialog
